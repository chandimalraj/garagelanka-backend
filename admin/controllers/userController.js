const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
var otpGenerator = require("otp-generator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");
// Bring user model
const User = require("../../models/User");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

exports.findUserByMobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(200).json({ errors: [{ msg: "There is no user" }] });
    } else {
      const payload = {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          userRole: user.userRole,
        },
      };

      res.status(200).json(payload);
    }

    // Return user

    // res.send('user');
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.finduser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, nic } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ $or: [{ mobile: mobile }, { nic: nic }] });

    if (!user) {
      res.status(200).json({ errors: [{ msg: "There is no user" }] });
    }

    // Return user
    console.log("find");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.forgotpassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ email: email });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user for this email" }] });
    }

    // send email

    // generate Randoom String
    const randomString = crypto.randomBytes(3).toString("hex");
    var emailString = "<b> Your Garage Lanka account recovery code : ";
    emailString = emailString.concat(randomString);
    emailString = emailString.concat("</b>");
    // update User resetString

    // Encrypth the string
    const salt = await bcrypt.genSalt(10);
    user.resetString = await bcrypt.hash(randomString, salt);
    user.resetStringTime = new Date();
    await user.save();

    console.log("mail host :", config.get("host"));
    // send password reset email

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: config.get("host"),
      port: config.get("port"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get("securityEmail"),
        pass: config.get("securityEmialPassword"),
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Garage Lanka" <security@garagelanka.lk>', // sender address
      to: email, // list of receivers
      subject: "Garage Lanka account recovery code", // Subject line
      text: randomString, // plain text body
      html: emailString, // html body
    });

    console.log(email);

    res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, code } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ email: email });

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ msg: "There is no user for this email" }] });
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
        email: user.email,
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

exports.newPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { password } = req.body;

  try {
    // see if user exixts
    const email = req.user.email;
    let user = await User.findOne({ email: email });

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

    // send password success email

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: config.get("host"),
      port: config.get("port"),
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.get("securityEmail"),
        pass: config.get("securityEmialPassword"),
      },
    });

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
    var emailText = "Hi ";
    emailText = emailText.concat(userFirstName);
    emailText = emailText.concat(
      ",Your Garage Lanka password was changed on :"
    );
    emailText = emailText.concat(dateTime);

    var emailHtml = "<b>";
    emailHtml = emailHtml.concat(emailText);
    emailHtml = emailHtml.concat("</b>");
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Garage Lanka" <security@garagelanka.lk>', // sender address
      to: email, // list of receivers
      subject: "Garage Lanka account password reseting", // Subject line
      text: emailText, // plain text body
      html: emailHtml, // html body
    });

    // console.log(email);

    res
      .status(200)
      .send("Password Has been reseted successfully and email sent");

    // res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

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
