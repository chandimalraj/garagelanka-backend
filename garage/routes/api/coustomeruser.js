const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const userController = require("../../controllers/customeruser");

// @route   POST api/coustomeruser/register
// @desc    Register User
// @access  Public
router.post("/registercustomeruser", auth, [
  body("firstName", "First Name in required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),

  userController.registerCustomerUser,
]);

// @route   POST api/coustomeruser/registervehicle
// @desc    Register vehicles
// @access  Private
router.post(
  "/registercustomeruservehicle",
  auth,
  [
    body("nic", "nic is required").not().isEmpty(),
    body("mobile", "mobile is required").not().isEmpty(),
    body("vehicleId", "VehicleId is required").not().isEmpty(),
    body("province", "province is required").not().isEmpty(),
    body("make", "make is required").not().isEmpty(),
    body("make_name", "make is required").not().isEmpty(),
    body("model", "model name is required").not().isEmpty(),
    body("model_name", "model name is required").not().isEmpty(),
    body("fuel_type", "fuel type is required").not().isEmpty(),
    body("year", "year is required").not().isEmpty(),
    body("odometer", "Odometer value (KM) is required").not().isEmpty(),
  ],
  userController.registerVehicle
);

module.exports = router;
