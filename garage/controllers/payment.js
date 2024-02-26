const config = require("config");
const axios = require("axios");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const moment = require("moment");

const Payment = require("../../models/Payment");

const User = require("../../models/User");
const GarageUser = require("../../models/GarageUser");
const ServiceCenter = require("../../models/ServiceCenter");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");
// add bookings with service type id
exports.createPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let payment = ({ paymentAmmountLKR, paymentMethod, coustomerNIC } =
      req.body);

    const validYears = +paymentAmmountLKR / 1200;
    const expiryDate = moment().utc().add(validYears, "y").format();

    payment.paymentExpiryDate = expiryDate;
    payment.paymentMethod = "Through Service Center";
    payment.payedby = "serviceCenter";
    payment.scUser = req.user.id;
    payment.serviceCenterID = req.user.serviceCenter._id;

    let user = await User.findOne({ nic: req.body.coustomerNIC });
    if (!user) return res.status(400).send("There is no user for thic NIC");

    payment.user = user;

    // console.log(bookingFields);

    payment = new Payment(payment);

    const savedPayment = await payment.save();

    // send success sms to user

    //  get user mobile
    let mobilenum = user.mobile;

    // rearranging mobile numbers to send sms
    mobilenum = mobilenum.substring(1);
    mobilenum = "94".concat(mobilenum);

    // send msg notify to user
    const msg = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: mobilenum,
      message: `Your payment ${paymentAmmountLKR}LKR has been successfully recorded  with Thannks`,
    });

    // console.log("msg ", msg);

    res.status(200).json({
      data: savedPayment,
      msg: `Your payment ${paymentAmmountLKR}LKR has been successfully recorded  with Thannks`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
