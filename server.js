require('dotenv').config();
const express=require('express')
const app=express();
const authRoutes=require('./routes/auth-routes')
const homeRoutes=require('./routes/home-routes')
const adminRoutes=require('./routes/admin-routes')
const uploadImageRoutes=require('./routes/image-routes')
const dbconnect=require('./database/db')
const PORT=process.env.PORT


dbconnect()

app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/home',homeRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/image',uploadImageRoutes)

app.listen(PORT,()=>{
    console.log(`running on ${PORT}`)
})