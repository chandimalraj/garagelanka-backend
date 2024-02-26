const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const config = require("config");
var otpGenerator = require("otp-generator");
const axios = require("axios");

const otpController = require("../../controllers/otp");

// @route   POST api/otp
// @desc    Send OTP
// @access  Public
router.post(
  "/",
  [
    body("mobile", "Please enter a valid Mobile Number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  otpController.sendOTP
);

// @route   POST api/otp/verify
// @desc    Send OTP
// @access  Public
router.post(
  "/verify",
  [
    body("mobile", "Please enter a valid Mobile Number").isLength({
      min: 10,
      max: 10,
    }),

    body("code", "Please enter a valid OTP Code").isLength({
      min: 6,
      max: 6,
    }),
  ],
  otpController.verifyotp
);

module.exports = router;
