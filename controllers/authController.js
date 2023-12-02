const USERS =require('../Models/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


const doSignUp=async (req,res)=>{

  const  hai = await USERS.findOne({email:req.body.email}) 
  if(hai){
    res.status(200).json({meassage:"email already exist"})
    return
  }
    
    console.log(req.body); 
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
console.log(hash);
USERS({
    fname:req.body.fName,
    lname:req.body.lName,
    email:req.body.email,
    password:hash
}).save().then((response)=>{
res.status(200).json({meassage:"signup successfull"})
})

      });
    
}
const doLogin=async (req,res)=>{
const user=await USERS.findOne({email:req.body.email})
if(user){
bcrypt.compare(req.body.password,user.password,(err,hashRes)=>{
if(hashRes){
  const token=jwt.sign({userId:user._id,email:user.email,fname:user?.fname,lname:user.lname,role:user?.role},"bookmycourt" ,{expiresIn:'2d'})
user.password=undefined
  res.status(200).json({message:'login successfull',token:token,user:user})
}
})
}else{
  res.status(200).json({message:"invalid credentials",token:null})
}
}




module.exports={doSignUp, doLogin}