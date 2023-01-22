import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({            //* <-- Yah hai Database Obj 
    name:{type:String, required:true,trim:true},
    email:{type:String, required:true,trim:true},
    phone:{type:Number,required:true},
    age:{type:Number,required:true},
    password:{type:String, required:true,trim:true},
    date:{ type: Date, default:Date.now},
    tc:{type:Boolean, default:true}
});


const userModel = mongoose.model("user",userSchema);


export default userModel