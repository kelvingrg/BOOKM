const mongoose =require('mongoose')
const connectDb=async ()=>{
    try{
        const connection=await mongoose.connect('mongodb://127.0.0.1:27017/bookmycourt',{
            useNewUrlParser:'true'
        })
        console.log("MongoDb data base connected");
    }
    catch(err){
        console.log(err);
    }
}
module.exports=connectDb