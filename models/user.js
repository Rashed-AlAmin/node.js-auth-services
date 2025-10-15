const mongoose=require('mongoose')


const newSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        requird:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{type:String,
        enum:['user','admin'],
        default:'user'
    }
},{timestamps:true})

module.exports=mongoose.model('User',newSchema)