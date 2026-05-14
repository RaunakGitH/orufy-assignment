const mongoose = require("mongoose")
const { type } = require("node:os")
const { date } = require("zod")
const { tr } = require("zod/v4/locales")
const userSchema = new mongoose.Schema({
    emailOrPhone:{
        type:String,
        required: true,
        unique:true,
        trim:true,
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
},
{timestamps:true}
)

module.exports = mongoose.model('User',userSchema)