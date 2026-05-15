const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateOTP = () => {
 return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/login', async (req,res)=>{
  const {emailOrPhone} = req.body;
  if(!emailOrPhone){
    return res.status(400).json({
      success:false,
      message:"Email or Phone required"
    })
  }
  try{
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await User.findOneAndUpdate(
      {
        emailOrPhone
      },{
        otp,otpExpiry
      },{
        upsert:true,returnDocument:"after"
      }
    )
    console.log(`OTP : ${otp}`)
    res.json({
      success:true,
      message:"OTP sent successfully",
      otp
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
})


router.post('/verify-otp',async (req,res)=>{
  const {emailOrPhone , otp} = req.body;
  if(!emailOrPhone){
    return res.status(400).json({
      success:false,
      message:"Email or Phone required"
    })
  }
  try{
    const user = await User.findOne({emailOrPhone})
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }
    if(user.otp !== otp){
      return res.status(400).json({
        success:false,
        message:"Invalid OTP"
      })
    }
    if(user.otpExpiry < new Date()){
      return res.status(400).json({
        success:false,
        message:"OTP Expired"
      })
    }

    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    const token = jwt.sign(
      {id:user._id, emailOrPhone: user.emailOrPhone},
      process.env.JWT_SECRET,{
        expiresIn:'1d'
      }
    )
    res.json({
      success:true,
      messsage:"Login Successfull",
      token,
      user:{id:user._id,emailOrPhone:user.emailOrPhone},
      
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
})

module.exports = router;