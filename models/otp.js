const mongoose = require("mongoose");

//OTP system

const OTPSchema = new mongoose.Schema({
  mobile: {
    type: String,
  },
  otp_code: {
    type: String,
  },
  otp_time: {
    type: Date,
  },
});

module.exports = OTP = mongoose.model("otp", OTPSchema);
