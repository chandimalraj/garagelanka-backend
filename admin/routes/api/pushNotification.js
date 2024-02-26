const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const pushnotification = require("../../controllers//pushNotification");

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.post(
  "/sendnews",
  auth,

  pushnotification.sendnotifications
);

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.post(
  "/updatenews",
  [body("id", "news id is required").not().isEmpty()],
  auth,

  pushnotification.updateNews
);

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.delete(
  "/deleteNews",
  [body("id", "news id is required").not().isEmpty()],
  auth,

  pushnotification.deleteNews
);

// @route   GET /api/notification/news.
// @desc    get lesast new
// @access  Public
router.get("/loadlastnews", pushnotification.loadLastNews);

// send push notifications

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.post(
  "/sendnotification",
  auth,

  pushnotification.sendpushNotification
);

module.exports = router;
