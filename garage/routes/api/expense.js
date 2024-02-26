const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../../middleware/auth");
const expense = require("../../controllers/expense");

//router.get("/", instantBillController.loadinstantBills);
//router.get("/loadinstantBillsbyRef", instantBillController.loadinstantBillbyRef);

// @route   POST api/instantBill
// @desc    add bills for instant purchases
// @access  Public
router.post("/add", auth, expense.addExpense);

router.get("/", auth, expense.getAllExpenses);

router.get("/:from/:to", auth, expense.getExpensesByDates);

module.exports = router;
