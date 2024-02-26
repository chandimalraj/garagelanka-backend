const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring booking controller
const firebaseController = require("../../controllers/fireBase");

// @route   POST api/firebase/updatefuelstationfirebaseid
// @desc    update userfirebaseid
// @access  Private
router.post(
  "/updateid",
  auth,
  [body("fireBaseId", "fireBaseId is required").not().isEmpty()],
  firebaseController.updateFuelStationFirebaseId
);

// get user firebase id

// @route   GET api/firebase/getuserfirebaseid
// @desc    get user firebaseid
// @access  Private

router.get(
  "/getuserfirebaseid",
  auth,
  firebaseController.getUserFuelStationFirebaseId
);

module.exports = router;
