const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const vehicleTypeController = require("../../controllers/vehicleTypes");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get("/loadvehicletype", vehicleTypeController.loadAllVehicleTypes);

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public
router.post(
  "/addvehicletype",
  [body("vehicleTypeName", "vehicleTypeName is required").not().isEmpty()],
  auth,
  vehicleTypeController.addVehicleType
);

module.exports = router;
