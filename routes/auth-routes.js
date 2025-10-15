const express=require('express')
const router=express.Router()
const {hello,addNew,deleteUser,registerUser,loginUser}=require('../controller/auth-controller')
router.get('/hello',hello)
router.post('/add',addNew)
router.delete('/delete/:id',deleteUser)
router.post('/register',registerUser)
router.post('/login',loginUser)
module.exports=router;