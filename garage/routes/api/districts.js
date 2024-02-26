const path = require("path");
const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");

const District = require("../../../models/District");
const districtController = require("../../controllers/District");

// @route   POST api/district
// @desc    Load district By District Id
// @access  Public

router.get(
  "/getDistrictByDistrictId",
  auth,
  districtController.getDistrictById
);

module.exports = router;
