const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const salesController = require("../../controllers/sales");

// @route   GET/api/salesRecords/getSalesRecords
// @desc   get all instant Sales done by the service center
// @access  Private
router.get("/getSalesRecords", auth, salesController.getSalesRecordsBysc_id);

module.exports = router;
