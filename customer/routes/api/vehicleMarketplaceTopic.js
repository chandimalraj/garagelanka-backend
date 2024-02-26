const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const marketplaceTopic = require("../../controllers/marketplaceTopics");

// @route   POST api/fuelstation/updatefuelavailability
// @desc    Update fuel availability
// @access  Private
router.post(
  "/subscribe",
  auth,
  [
    body("make", "make is required").exists(),
    body("makeName", " makeName is required").exists(),
    body("model", "model is required").exists(),
    body("modelName", "modelName is required").exists(),
    body("firebaseId", "firebaseId is required").exists(),
  ],

  marketplaceTopic.subscribeToTopic
);

router.get(
  "/loadsubscribelist",
  auth,

  marketplaceTopic.subscibeList
);

// @route   DELETE api/marketplacetopic/unsubscribe
// @desc    unsubscribe topic
// @access  Private
router.post(
  "/unsubscribe",
  auth,
  [
    body("topic", "topic is required").exists(),
    body("firebaseId", "firebaseId is required").exists(),
  ],
  marketplaceTopic.unSubscribeToTopic
);

router.get(
  "/loadvehiclenotifications",
  auth,

  marketplaceTopic.loadvehicleNotifications
);
module.exports = router;
