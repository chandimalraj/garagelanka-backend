const config = require("config");
const axios = require("axios");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const Booking = require("../../models/Payment");

const User = require("../../models/User");

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
    let payment = ({
      paymentAmmountLKR,
      paymentMethod,
      paymentDateAndTime,
      Bank,
      branch,
      slipId,
    } = req.body);

    payment.user = req.user.id;
    payment.payedby = "customer";

    // console.log(bookingFields);

    payment = new Booking(payment);

    console.log("Payment details with  ", payment);

    await payment.save();

    // send success sms to user

    // find user
    console.log("user", req.user.id);
    let user = await User.findById({
      _id: ObjectId(req.user.id),
    });

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
      msg: `Your payment ${paymentAmmountLKR}LKR has been successfully recorded  with Thannks`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
