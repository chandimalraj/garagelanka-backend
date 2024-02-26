const config = require("config");
const { validationResult } = require("express-validator");
var otpGenerator = require("otp-generator");
const axios = require("axios");
const bcrypt = require("bcryptjs");

// bring user model and otp model
const User = require("../../models/GarageUser");
const OTP = require("../../models/otp");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

exports.sendOTP = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // see if mobile number exists
    var mobile = req.body.mobile;
    console.log("User inserted mobile numbeer : " + mobile);

    mobile = mobile.substring(1);
    console.log("after removing satrting 0 ", mobile);
    mobile = "94".concat(mobile);

    console.log("after mobile concat", mobile);

    let user = await User.findOne({ mobile: mobile });

    if (user) {
      res
        .status(400)
        .json({ errors: [{ msg: "Mobile number alrady exsist." }] });
    }

    let phone = await OTP.findOne({ mobile: mobile });

    if (phone) {
      const deleteResult = await OTP.deleteOne({ mobile: mobile });
      console.log("This phone number request OTP more than one time");
      console.log(`${deleteResult.deletedCount} document(s) was/were deleted.`);
    }

    const otpcode = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    try {
      // Encrypth the otp code
      const salt = await bcrypt.genSalt(10);
      otp_code = await bcrypt.hash(otpcode, salt);

      // Build otp Object
      const otpFields = {};
      otpFields.mobile = mobile;
      otpFields.otp_code = otp_code;
      otpFields.otp_time = Date.now();

      //Add new otp
      otp = new OTP(otpFields);

      // save the otp code to database
      await otp.save();

      const res = await axios.post("https://app.notify.lk/api/v1/send", {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: mobile,
        message: otpcode,
      });
      console.log(res.data);
    } catch (err) {
      if (err.response) {
        // the request went through and a response was returned
        // status code in 3xx / 4xx / 5xx range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // request was made but server returned no response
        console.log(err.request);
      } else {
        // something went wrong in setting up the request
        console.error("Error:", err.message);
      }
    }

    res.status(200).send("OTP sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.verifyotp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var { mobile, code } = req.body;

  // change the mobile number for notyfty sms

  mobile = mobile.substring(1);
  mobile = "94".concat(mobile);

  try {
    // see if user exixts
    let otp = await OTP.findOne({ mobile: mobile });

    if (!otp) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no otp for this phone" }] });
    }

    // check for the time difference between code sent time and checking time

    var diffMs = new Date().getTime() - otp.otp_time.getTime();

    diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    console.log("Time difference between two times :", diffMins);

    if (diffMins > 20) {
      const deleteResult = await OTP.deleteOne({ mobile: mobile });
      console.log(`${deleteResult.deletedCount} document(s) was/were deleted.`);

      res.status(400).json({ errors: [{ msg: "otp code has been expired" }] });
    }

    // check for the password
    const isMatch = await bcrypt.compare(code, otp.otp_code);

    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: "Invalid Code" }] });
    } else {
      console.log("came to this even otp cde is invalid");
      const deleteResult = await OTP.deleteOne({ mobile: mobile });
      console.log(`${deleteResult.deletedCount} document(s) was/were deleted.`);
      res.status(200).send("otp code verified");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
