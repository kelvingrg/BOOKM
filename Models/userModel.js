const mongoose=require('mongoose')

const userShema=mongoose.Schema({
fname:{
    type:String,
    required:true
},
lname:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
role:{
    type:Number,
    required:true,
    default:3  // user 
}
//user-3
//admin -1
})


const users=mongoose.model('users',userShema)
module.exports=users