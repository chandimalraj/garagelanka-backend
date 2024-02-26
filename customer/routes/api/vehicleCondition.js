const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const vehicleConditionControler = require("../../controllers/vehicleCondition");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get(
  "/loadvehicleconditions",
  vehicleConditionControler.loadAllVehicleConditions
);

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public
router.post(
  "/addvehicleconditions",
  [body("vehicleCondition", "vehicleCondition is required").not().isEmpty()],
  auth,
  vehicleConditionControler.addVehicleCondition
);

module.exports = router;
// vehicle
