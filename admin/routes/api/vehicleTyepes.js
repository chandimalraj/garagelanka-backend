const path = require("path");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body } = require("express-validator");

const vehicleTypeController = require("../../controllers/vehicleTypes");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get("/loadvehicletype", vehicleTypeController.loadAllVehicleTypes);

// @route POST api/serviceTypes
// @desc Add service types
// @access public
router.post(
  "/registervehicletype",
  auth,
  [body("VehicleTypeName", "VehicleTypeName is required").not().isEmpty()],
  vehicleTypeController.registerVehicleType
);

module.exports = router;
