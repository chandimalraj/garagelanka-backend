// bring supplier models
const { validationResult } = require("express-validator");
const SmsRequest = require("../../models/SmsRequest");

exports.requestSms = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const SmsRequestrData = req.body;
    SmsRequestrData.serviceCenterId = req.user.serviceCenter._id;
    SmsRequestrData.status = "pending";

    const newSmsRequest = new SmsRequest(SmsRequestrData);
    await newSmsRequest.save();
    return res.status(200).send("sms Request has been saved successfully");
    // return;
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

// get all pending sms
exports.getAllpendingsms = async (req, res) => {
  console.log("Loading all Customers...");
  try {
    const pendingsms = await SmsRequest.find({
      serviceCenterId: req.user.serviceCenter._id,
      status = "pending"
    });
    res.status(200).json(pendingsms);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
