const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const fuelStation = require("../../controllers/fuelStationController");

// @route   POST api/fuelstation/register
// @desc    Register Fuel Station
// @access  Public
router.post(
  "/updatefuelstation",
  auth,
  [body("fuelStationId", "fuelStationId is required").not().isEmpty()],
  fuelStation.updateFuelStation
);

// @route   GET api/fuelstation/
// @desc    get all service types
// @access  Private

router.get("/getfuelstations", auth, fuelStation.loadAllFualStations);

// register unregisterd fuel station

// @route   POST api/fuelstation/register
// @desc    Register Fuel Station
// @access  Public
router.post("/registerunregisterd", auth, [
  body("StationName", "StationName in required").not().isEmpty(),
  body("suburb", "suburb of the fuel station required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  body("location", "location of the fuel station required").not().isEmpty(),
  body("status", "status of the fuel station required").not().isEmpty(),
  body("open", "open or close of the fuel station required").not().isEmpty(),

  body(
    "password",
    "Please Enter a password with 4 or more characters"
  ).isLength({ min: 4 }),
  fuelStation.registerUnregisterdFuelStation,
]);

module.exports = router;
