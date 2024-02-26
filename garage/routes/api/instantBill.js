const path = require("path");
const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");

const auth = require("../../middleware/auth");
const instantBillController = require("../../controllers/instantBill");

//router.get("/", instantBillController.loadinstantBills);
//router.get("/loadinstantBillsbyRef", instantBillController.loadinstantBillbyRef);

// @route   POST api/instantBill
// @desc    add bills for instant purchases
// @access  Public
router.post(
  "/",
  auth,
  [
    body("serviceCenterId", "serviceCenterId  is required")
      .isString()
      .isMongoId()
      .not()
      .isEmpty(),
    body("customer", "customer is required").isObject().notEmpty(),
    check("customer.name").not().isEmpty(),
    check("customer.mobile").not().isEmpty(),
    body("itemList", "itemList is required").isArray().not().isEmpty(),
    body("billingDate", "billingDate is required").not().isEmpty(),
    body("category", "category price is required").isString().not().isEmpty(),
    body("totalAmount", "totalAmount is required").isNumeric().not().isEmpty(),
    body("discount", "discount is required").isNumeric().not().isEmpty(),
    body("grandTotal", "grandTotal is required").isNumeric().not().isEmpty(),
    body("description", "description is required").isString(),
  ],
  instantBillController.addInstantBill
);

module.exports = router;
