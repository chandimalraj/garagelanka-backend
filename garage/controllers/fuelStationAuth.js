const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
var otpGenerator = require("otp-generator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");
// Bring user model
const User = require("../../models/FillingStation");
var ObjectId = require("mongodb").ObjectID;

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

exports.auth = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, password, fireBaseId } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // check for the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    // update firebase id

    if (fireBaseId) {
      // save user
      await user.updateOne({
        fireBaseId: fireBaseId,
      });
    }

    // Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
        userRole: user.userRole,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),

      (error, token) => {
        if (error) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// forgot password mobile

exports.forgotpasswordmobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var { mobile } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user for mobile" }] });
    }

    // send msg

    // generate Randoom code
    const randomCode = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Encrypth the string
    const salt = await bcrypt.genSalt(10);
    user.resetString = await bcrypt.hash(randomCode, salt);
    user.resetStringTime = new Date();
    await user.save();

    // send password reset msg

    // reconstruct the mobile
    mobile = mobile.substring(1);
    console.log("after removing satrting 0 ", mobile);
    mobile = "94".concat(mobile);

    const response = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: mobile,
      message: `Your garage lanka account password reset code is ${randomCode} `,
    });

    console.log("response", response.data);

    res.status(200).send("msg sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// verify reset password mobile

exports.resetPasswordmobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var { mobile, code } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user for this mobile" }] });
    }

    // check for the time difference between code sent time and checking time

    var diffMs = new Date().getTime() - user.resetStringTime.getTime();

    diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

    console.log("Time difference between two times :", diffMins);

    if (diffMins > 20) {
      res
        .status(400)
        .json({ errors: [{ msg: "Password recovery code has been expired" }] });
    }

    // check for the password
    const isMatch = await bcrypt.compare(code, user.resetString);

    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: "Invalid Code" }] });
    }

    // Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
        passwordreset: true,
        mobile: user.mobile,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 1200,
      },
      (error, token) => {
        if (error) throw err;
        res.json({ token });
      }
    );

    // res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// verify reset password by receiving sms

exports.newPasswordmobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;

  try {
    // see if user exixts
    var mobile = req.user.mobile;
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user invalid attempt" }] });
    }

    // get the user name

    const userFirstName = user.firstName;

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to the database
    await user.save();

    // send password success msg

    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    var msgText = "Hi ";
    msgText = msgText.concat(userFirstName);
    msgText = msgText.concat(",Your Garage Lanka password was changed on :");
    msgText = msgText.concat(dateTime);

    // send password reset msg

    // reconstruct the mobile
    mobile = mobile.substring(1);
    console.log("after removing satrting 0 ", mobile);
    mobile = "94".concat(mobile);

    const respose = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: mobile,
      message: msgText,
    });
    console.log(respose.data);

    res.status(200).send("Password Has been reseted successfully and msg sent");

    // res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// update user password

exports.updateUserPasswod = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password, newPassword } = req.body;

  try {
    // see if user exixts

    let user = await User.findOne({
      _id: ObjectId(req.user.id),
    });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user invalid attempt" }] });
    }

    console.log("password of the user cuurent", password);
    // check for the password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match", isMatch);

    if (!isMatch) {
      res.status(400).json({ errors: [{ msg: "Invalid Current Pasword" }] });
    } else {
      // get the user name

      const userFirstName = user.firstName;

      // Encrypth the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      // save the user to the database
      await user.save();

      // send password success msg

      var today = new Date();
      var date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + " " + time;
      var msgText = `Hi ${userFirstName} Your Garage Lanka password was changed on : ${dateTime}`;

      // send password reset msg

      // reconstruct the mobile
      mobile = user.mobile.substring(1);
      console.log("after removing satrting 0 ", mobile);
      mobile = "94".concat(mobile);

      const respose = await axios.post("https://app.notify.lk/api/v1/send", {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: mobile,
        message: msgText,
      });
      console.log(respose.data);

      res
        .status(200)
        .send("Password Has been reseted successfully and msg sent");
    }
    // fuel auth handled
    // res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
