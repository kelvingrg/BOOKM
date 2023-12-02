const COURT_SCHEDULES=require('../Models/courtSchedules.js')
const Razorpay = require("razorpay")
const crypto= require('crypto')
const nodemailer = require("nodemailer");
const COURTS =require('../Models/courtSchema.js')

const orders =async (req,res)=>{
   const slotData= await COURT_SCHEDULES.findOne({_id:req.body.slotId})
   console.log(slotData)
   if(slotData?.bookedBy){
res.status(400).json({message:'slot already booked'}) 
   }else

    {try {
        const instance = new Razorpay({
            key_id: 'rzp_test_RmJEvDzXfqDrXm',
            key_secret:'vBtVT8oayBFWKfPtCnpOP6G6',
        });

        const options = {
            amount: slotData.cost*100, // amount in smallest currency unit
            currency: "INR",
            receipt: slotData._id,
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }}
}

const paymentSuccess=async (req,res)=>{
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            slotId
        } = req.body;
console.log(slotId,"****");
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "vBtVT8oayBFWKfPtCnpOP6G6");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

            await  COURT_SCHEDULES.updateOne({_id:slotId},{$set:{bookedBy:req.userId},$push:{ paymentOrders:{userId:req.userId,razorpayPaymentId,timeStamp:new Date()}  }})
            initiateEmail(slotId,razorpayPaymentId)

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error); 
    }
}
const initiateEmail=async (id,razorpayPaymentId)=>{ 
  const  slotData=  await  COURT_SCHEDULES.findOne({_id:id}).populate('bookedBy').populate('courtId')
  console.log(slotData);
  const {date,slot,cost,bookedBy,courtId}=slotData
  const transporter = nodemailer.createTransport({
      service:'Gmail',
        auth: {
          user: 'testkelvin05@gmail.com',
          pass: 'kmwp dspj lfxz lbpf'
        }
      });


        const info = await transporter.sendMail({
          from: 'testkelvin05@gmail.com', 
          to: bookedBy.email,
          subject: "Booking confirmed", 
          text: "thanks for booking with us !", 
          html: `<b>Hellow ${bookedBy.firstName+' '+bookedBy.lastName} </b>
          <p>  your   booking  at ${courtId.name} on ${new Date(date) } at ${slot.name} has been confirmed with payment id ${razorpayPaymentId} </p>
          `, 
        });
      
        console.log("Message sent: %s", info.messageId);
        
      }
module.exports={orders,paymentSuccess}