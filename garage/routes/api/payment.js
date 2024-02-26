const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
// bring booking controller
const paymentController = require("../../controllers/payment");

// @route   POST api/makeabooking
// @desc    make a sservice booking
// @access  Private
router.post(
  "/createpayment",
  auth,
  [
    body("paymentAmmountLKR", "Payment ammounbt in LKR is required")
      .not()
      .isEmpty(),
    body("paymentMethod", "Payment method is required").not().isEmpty(),
  ],
  paymentController.createPayment
);

module.exports = router;
