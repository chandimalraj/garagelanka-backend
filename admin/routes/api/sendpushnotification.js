const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const sendNotification = require("../../controllers/sendNotification");

// send push notifications

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.post(
  "/sendnotificationtospecificdevice",
  auth,
  // [body("mobile", "Please Enter a valid mobile number").not().isEmpty()],

  sendNotification.sendpushNotification
);

module.exports = router;
