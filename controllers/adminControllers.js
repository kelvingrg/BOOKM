const COURT =require('../Models/courtSchema')
const COURT_SCHEDULES=require('../Models/courtSchedules')

const addCourtData=async (req,res)=>{
    try {
        await COURT({courtName:req.query.courtName,
            location:req.query.location,
             address:req.query.address,
             type:req.query.type,
            courtPic:req.file.filename}).save()
            res.status(200).json('court registration successfull')
    } catch (error) {
        res.status(500).json('court registration failed')
    }



}
const addTimeSlotData =(req,res)=>{
const {startDate, endDate, cost, selectedTimings, courtId}=req.body
let currentDate= new Date(startDate)
const lastDate= new Date(endDate)
const slotObjects=[]

while(currentDate<=lastDate){
    for(let data of selectedTimings){
        console.log(currentDate);
        slotObjects.push({
            date: JSON.parse(JSON.stringify(currentDate)),
            slot:{
                name:data.name,
            id:data.id,
            },
            cost,
            courtId
        })
    }
    currentDate.setDate(currentDate.getDate()+1)
}
COURT_SCHEDULES.insertMany(slotObjects).then((resp)=>{
    res.status(200).json({message:"court time slots created successfully"})
})
console.log(slotObjects,'slots')
}

module.exports={addCourtData,addTimeSlotData}

