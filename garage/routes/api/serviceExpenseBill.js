const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../../middleware/auth");
const serviceExpenseBill = require("../../controllers/serviceExpenseBill");

//router.get("/", instantBillController.loadinstantBills);
//router.get("/loadinstantBillsbyRef", instantBillController.loadinstantBillbyRef);

// @route   POST api/instantBill
// @desc    add bills for instant purchases
// @access  Public
router.post(
    "/", 
    auth,
    serviceExpenseBill.addServiceExpenseBill);

module.exports = router;