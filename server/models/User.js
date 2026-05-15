const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    emailOrPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
