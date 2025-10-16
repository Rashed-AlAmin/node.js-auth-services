const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const User=require('../models/user')
const jwt=require('jsonwebtoken')

const hello=async (req,res)=>{
  res.status(200).json({
    message:'hello world'
  })
}

const addNew=async (req,res)=>{
  const addVal=req.body;
  const newUser=await User.create(addVal)
  if(!newUser){
    res.status(404).json('cannot add user')
  }else{
    res.status(200).json({
      success:true,
      message:'added',
      data:newUser
    })
  }
}
const deleteUser=async (req,res)=>{
  const getId=req.params.id;
  const deletedUser=await User.findByIdAndDelete(getId)
  if(!deleteUser){
    res.json('cannot delete')
  }else{
    res.status(200).json({
      message:'success',
      data:deletedUser
    })
  }
}

const registerUser=async (req,res)=>{
  try{
    const {username, email, password, role }=req.body;
    const existingUser= await User.findOne({$or:[{username},{email}]})
    if(existingUser){
      return res.status(400).json({
        success:false,
        message:'user already exists'
      })
    }else{
      const salt=await bcrypt.genSalt(10);
      const hashedPass= await bcrypt.hash(password,salt)

      const newlyCreatedUser= new User({
        username,
        email,
        password:hashedPass,
        role:role||'user'
      })
      await newlyCreatedUser.save();
      if(newlyCreatedUser){
        res.status(201).json({
          success:true,
          message:'user created successfully'
        })
      }else{
        res.status(400).json({
          success:false,
          message:'unable to create user'
        })
      }
    }
  }catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'some error occured'
    })
  }
}

const loginUser=async (req,res)=>{
  try{
    const {username, password}=req.body;
    const user= await User.findOne({username})
    if(!user){
      res.status(400).json({
        success:false,
        message:'user does not exists'
      })
    }
    const ifPassMatch= await bcrypt.compare(password,user.password);
    if(!ifPassMatch){
      res.status(400).json({
        success:false,
        message:'invalid credential'
      })
    }
    //create user token
    const accessToken= jwt.sign({
      userId:user._id,
      username:user.username,
      role:user.role
    }, process.env.jwt_secret_key,{
      expiresIn:'30m'
    })
    res.status(200).json({
      success:true,
      message:'logged in successfully',
      accessToken
    })
  }catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'some error occured'
    })
  }
}
const changePassword=async(req,res)=>{
  try{
  const userId=req.userInfo.userId;
  const {oldPassword,newPassword}=req.body;
  const user=await User.findById(userId)
  if(!user){
    res.status(400).json({
      success:false,
      message:'user cannot be found'
    })
  }
  //if the old password match
  const isPassMatch= await bcrypt.compare(oldPassword,user.password)
  if(!isPassMatch){
    return res.status(400).json({
      success:false,
      message:'old password does not match'
    })
  }
  // hash the new password
  const salt= await bcrypt.genSalt(10)
  const hashedNewPassword=await bcrypt.hash(newPassword,salt)
  // update user password
  user.password=hashedNewPassword;
  await user.save()
  res.status(200).json({
    success:true,
    message:'password changed successfully'
  })
}catch(e){
  console.log(e)
  res.status(500).json({
    message:'something is wrong'
  })
}
}
module.exports={hello,addNew,deleteUser,registerUser,loginUser,changePassword}