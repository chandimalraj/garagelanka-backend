const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const userController = require("../../controllers/user");

const serviceBillController = require("../../controllers/serviceBill");

router.put("/scuser/update", auth, [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("email", "Please Enter a valid email address").isEmail(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),
  userController.updateUser,
]);

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/scuser", auth, [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("salaryPerDay", "salaryPerDay is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),

  body("userRole", "user Role required").not().isEmpty(),
  body(
    "password",
    "Please Enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userController.registerUser,
]);

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/scusermobile", [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("email", "Please Enter a valid email address").isEmail(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),
  body("serviceCenterID", "serviceCenter ID  required").not().isEmpty(),
  body("userRole", "user Role required").not().isEmpty(),
  body(
    "password",
    "Please Enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userController.registerUser,
]);

// @route   GET api/users
// @desc    get vehicles of customer by mobile number
// @access  Private
router.get("/get-vehicles", auth, [
  // query("mobile", "Mobile number is required"),    // info not working
  serviceBillController.getVehiclesByMobileNumber,
]);

// Register pending owner
router.post("/registerpendingowners", [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),
  body("garageName", "garageName required").not().isEmpty(),

  userController.registerPendingOwners,
]);
module.exports = router;
