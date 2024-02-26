const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const fuelTypeController = require("../../controllers/fuelType");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get("/", fuelTypeController.loadAllFuelTypes);

// @route POST api/serviceTypes
// @desc Add service types
// @access public
router.post(
  "/",
  [
    body("fuelTypeName", "fuelTypeName is required").not().isEmpty(),
    body("fuelTypeimageURL", "fuelTypeimageURL is required").not().isEmpty(),
  ],
  fuelTypeController.registerFuelType
);

module.exports = router;
