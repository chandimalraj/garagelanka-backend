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
var ObjectId = require("mongodb").ObjectID;

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

exports.auth = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { mobile, password, fireBaseId } = req.body;

    try {
      console.log("request body", req.body);

      // see if user exixts
      let user = await User.findOne({ mobile: mobile });

      if (!user) {
        console.log("There is no user");
        res
          .status(400)
          .json({ errors: [{ msg: "There is no user register again" }] });
      } else {
        // check for the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log("Ipassword is not correct");
          res
            .status(400)
            .json({ errors: [{ msg: "password is not correct" }] });
        } else if (user.status !== "ACTIVATED") {
          console.log("User is not activated statue");
          res.status(400).json({
            errors: [
              {
                msg: `Your account is not ACTIVATED `,
                status: user.status,
              },
            ],
          });
        } else {
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
              firstName: user.firstName,
              lastName: user.lastName,
              mobile: user.mobile,
              email: user.email,
              userRole: user.userRole,
              profilePictureLink: user.profilePictureLink,
              paymentExpire: user.expiryDate,
              status: user.status,
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
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

exports.mobileauth = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { mobile, password, fireBaseId } = req.body;
    console.log("request body mobile auth ", req.body);
    try {
      // see if user exixts
      let user = await User.findOne({ mobile: mobile });

      if (!user) {
        res
          .status(400)
          .json({ errors: [{ msg: "There is no user register again" }] });
      } else {
        // check for the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          res
            .status(400)
            .json({ errors: [{ msg: "password is not correct" }] });
        }

        // update firebase id

        user.fireBaseId = fireBaseId;

        // Return jsonwebtoken

        const payload = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            userRole: user.userRole,
            paymentExpire: user.expiryDate,
            status: user.status,
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
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

exports.forgotpassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
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

      // generate Randoom code
      const randomString = otpGenerator.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      // const randomString = crypto.randomBytes(3).toString("hex");

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
  }
};

// forgot password mobile

exports.forgotpasswordmobile = async (req, res) => {
  const errors = validationResult(req);

  console.log(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    var { mobile } = req.body;

    try {
      // see if user exixts
      let user = await User.findOne({ mobile: mobile });

      if (!user) {
        res
          .status(400)
          .json({ errors: [{ msg: "There is no user for this mobile" }] });
      } else {
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
        console.log("once after removing satrting 0 ", mobile);
        mobile = "94".concat(mobile);

        const response = await axios.post("https://app.notify.lk/api/v1/send", {
          user_id: userId,
          api_key: api_key,
          sender_id: sender_id,
          to: mobile,
          message: `Your garage lanka account password reset code is ${randomCode} `,
        });
        console.log(response.data);

        res.status(200).send("msg sent");
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

exports.resetPassword = async (req, res) => {
  console.log(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { email, code } = req.body;

    try {
      // see if user exixts
      let user = await User.findOne({ email: email });

      if (!user) {
        res
          .status(400)
          .json({ errors: [{ msg: "There is no user for this email" }] });
      } else {
        // check for the time difference between code sent time and checking time

        var diffMs = new Date().getTime() - user.resetStringTime.getTime();

        diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

        console.log("Time difference between two times :", diffMins);

        if (diffMins > 20) {
          res.status(400).json({
            errors: [{ msg: "Password recovery code has been expired" }],
          });
        } else {
          // check for the password
          const isMatch = await bcrypt.compare(code, user.resetString);

          if (!isMatch) {
            res.status(400).json({ errors: [{ msg: "Invalid Code" }] });
          } else {
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
          }
        }
      }

      // res.status(200).send("email sent");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
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
    } else {
      // check for the time difference between code sent time and checking time

      var diffMs = new Date().getTime() - user.resetStringTime.getTime();

      diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

      console.log("Time difference between two times :", diffMins);

      if (diffMins > 20) {
        res.status(400).json({
          errors: [{ msg: "Password recovery code has been expired" }],
        });
      }

      // check for the password
      const isMatch = await bcrypt.compare(code, user.resetString);

      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid Code" }] });
      } else {
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
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// verify reset password by receiving sms

// exports.resetpasswordreceivesms = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   var { mobile } = req.body;

//   try {
//     // see if user exixts
//     let user = await User.findOne({ mobile: mobile });

//     if (!user) {
//       res.status(400).json({
//         errors: [{ msg: "There is no user for mobile you have entered" }],
//       });
//     }

//     // send msg

//     // generate Randoom code
//     const randomPassword = otpGenerator.generate(6, {
//       upperCase: true,
//       specialChars: true,
//     });

//     // Encrypth the string
//     const salt = await bcrypt.genSalt(10);
//     user.resetString = await bcrypt.hash(randomPassword, salt);
//     user.resetStringTime = new Date();
//     await user.save();

//     // send password reset msg

//     // reconstruct the mobile
//     mobile = mobile.substring(1);
//     console.log("after removing satrting 0 ", mobile);
//     mobile = "94".concat(mobile);

//     const response = await axios.post("https://app.notify.lk/api/v1/send", {
//       user_id: userId,
//       api_key: api_key,
//       sender_id: sender_id,
//       to: mobile,
//       message: `Your garage lanka account password reset and your new password is  ${randomPassword} `,
//     });
//     console.log(response.data);

//     res.status(200).send("msg sent");
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };

exports.newPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // see if user exixts
  var email = req.user.email;
  let user = await User.findOne({ email: email });

  if (!user) {
    res
      .status(400)
      .json({ errors: [{ msg: "There is no user invalid attempt" }] });
  } else {
    const { password } = req.body;

    try {
      // get the user name

      const userFirstName = user.firstName;

      // Encrypth the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save the user to the database
      await user.save();

      // send password via email
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
      msgText = msgText.concat(",Your Garage Lanka password was reset on :");
      msgText = msgText.concat(dateTime);

      htmltxt = `</br> ${msgText} </br>`;
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
        text: msgText, // plain text body
        html: htmltxt, // html body
      });

      res
        .status(200)
        .send("Password has been reseted successfully email also sent");

      // res.status(200).send("email sent");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
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

    // console.log("password of the user cuurent", password);
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

    // res.status(200).send("email sent");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
