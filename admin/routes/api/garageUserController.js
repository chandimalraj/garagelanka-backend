const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const userController = require("../../controllers/garageUsercontroller");

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
  body("nic", "National identity card Number is required").not().isEmpty(),

  //   body("email", "Please Enter a valid email address").isEmail(),
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

// @route   POST api/users/
// @desc    Register User
// @access  Public
router.post("/scownerregister", auth, [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("serviceCenterID", "serviceCenterID is required")
    .not()
    .isEmpty(),

  //   body("email", "Please Enter a valid email address").isEmail(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),

  body(
    "password",
    "Please Enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  userController.registerOwner,
]);

module.exports = router;
