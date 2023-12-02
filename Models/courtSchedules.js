const mongoose=require('mongoose')

const courtScheduleSchema=mongoose.Schema({
date:{
        type:Date,
        required:true,
    },
    slot:{
        type:Object,
        required:true,
    },
    cost:{
        type:Number,
        required:true,
    },
    bookedBy:{
        type:mongoose.Types.ObjectId,
        ref:'users'
    },
    cancellation:{
        type:Array, // [{userID,paymnet}]
    },
    courtId:{
        type:mongoose.Types.ObjectId,
        ref:'courts'
    },
    paymentOrders:{
        type:Array
    }
})
const courtSchedules=mongoose.model('courtSchedules',courtScheduleSchema)
module.exports=courtSchedules