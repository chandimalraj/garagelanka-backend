const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const fuelStation = require("../../controllers/fuelStation");

// @route   POST api/fuelstation/register
// @desc    Register Fuel Station
// @access  Public
router.post("/register", [
  body("StationName", "StationName in required").not().isEmpty(),
  body("address", "address of the fuel station required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  body(
    "password",
    "Please Enter a password with 4 or more characters"
  ).isLength({ min: 4 }),
  fuelStation.registerFuelStation,
]);

// @route   POST api/fuelstation/updatefuelavailability
// @desc    Update fuel availability
// @access  Private
router.post(
  "/updatefuelavailability",
  auth,
  [body("fuelTypesProvided", "fuelTypeId is required").isArray()],

  fuelStation.updateFuelType
);

// @route   GET api/fuelstation/
// @desc    get all service types
// @access  Private

router.get(
  "/getfuelTypes",
  auth,
  fuelStation.loadAllFuelTypesProvidedByFuelStationId
);

module.exports = router;
