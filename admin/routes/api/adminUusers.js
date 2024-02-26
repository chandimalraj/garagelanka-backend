const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// bring user controller
const userController = require("../../controllers/adminUser");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/", [
  body("firstName", "First Name in required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("userRole", "User Role is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("email", "Please Enter a valid email address").isEmail(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  body(
    "password",
    "Please Enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userController.registerUser,
]);

module.exports = router;
