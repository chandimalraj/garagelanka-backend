const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../../middleware/auth");
const itemsExpenseBill = require("../../controllers/itemsExpenseBill");

//router.get("/", instantBillController.loadinstantBills);
//router.get("/loadinstantBillsbyRef", instantBillController.loadinstantBillbyRef);

// @route   POST api/instantBill
// @desc    add bills for instant purchases
// @access  Public
router.post(
    "/", 
    auth,
    itemsExpenseBill.addItemsExpenseBill);

module.exports = router;