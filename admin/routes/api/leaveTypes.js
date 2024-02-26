const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const leaveTypeController = require("../../controllers/leaveType");

// @route   POST api/leavetypes
// @desc    get all service types
// @access  Public

router.get("/", auth, leaveTypeController.loadAllLeaveTypes);

// @route POST api/leavetypes
// @desc Add leave types
// @access public
router.post(
  "/",
  auth,
  [
    body("leaveTypeName", "Leave Type Name is required").not().isEmpty(),
    body("duration", "Leave Duration is required").not().isEmpty(),
  ],
  leaveTypeController.registerLeaveType
);

module.exports = router;
