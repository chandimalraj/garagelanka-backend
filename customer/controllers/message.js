const { validationResult } = require("express-validator");
const config = require("config");
const nodemailer = require("nodemailer");
const Message = require("../../models/Message");

exports.addMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newMessage = new Message(req.body);
    const result = await newMessage.save();

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
      to: req.body.email, // list of receivers
      subject: "Garage Lanka Contact US", // Subject line
      text: "Thank you for contacting Garage Lanka We'll contact you soon. Have a nice day", // plain text body
      //html: emailString, // html body
    });

    res.json({ msg: "Message Recorded Successfully", result, info });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
