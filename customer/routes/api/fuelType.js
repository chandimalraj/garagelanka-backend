const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const fuelTypeController = require("../../controllers/fuelType");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get("/", fuelTypeController.loadAllFuelTypes);

module.exports = router;
