const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const vehicleManufacturedYearController = require("../../controllers/vehicleManufacturedYear");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get(
  "/loadvehiclemanufacturedyears",
  vehicleManufacturedYearController.loadAllVehicleManufacturedYears
);

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public
router.post(
  "/addvehiclemanufacturedyear",
  [body("year", "year is required").not().isEmpty()],
  auth,
  vehicleManufacturedYearController.addVehicleManufacturedYear
);

module.exports = router;
// vehicle
