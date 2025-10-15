const mongoose=require('mongoose')

const dbconnect=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('database connected successfully now')
    }catch(e){
        console.log('cannot connect to db')
        process.exit(1)
    }
}
module.exports=dbconnect