const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body } = require("express-validator");

// bring auth controller
const authController = require("../../controllers/fuelStationAuth");

router.post(
  "/",
  [
    body("mobile", "Please Enter a valid mobile number").not().isEmpty(),
    body("password", "Please Enter your password").exists(),
  ],
  authController.auth
);

// @route   POST api/auth/forgotpasswordmobile
// @desc    user forgot password
// @access  Public
router.post(
  "/forgotpasswordmobile",
  [
    body("mobile", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  authController.forgotpasswordmobile
);
// forgot password with email

// @route   POST api/auth/resetpasswordmobile
// @desc    user reset password by providing random string
// @access  Public
router.post(
  "/resetpasswordmobile",
  [
    body("mobile", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    body("code", "Please Enter a valid recovery code").isLength({
      min: 6,
      max: 6,
    }),
  ],

  authController.resetPasswordmobile
);

// @route   POST api/auth/newpasswordmobile
// @desc    user enter new passsword with specific token
// @access  Public
router.post(
  "/newpasswordmobile",
  auth,
  [
    body(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  authController.newPasswordmobile
);

// @route   POST api/auth/updateuserpasswod
// @desc    user enter new passsword with specific token
// @access  Public
router.post(
  "/updateuserpasswod",
  auth,
  [
    body(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),

    body(
      "newPassword",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  authController.updateUserPasswod
);

module.exports = router;
