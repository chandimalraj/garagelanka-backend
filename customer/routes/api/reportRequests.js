const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
// bring booking controller
const reportRequest = require("../../controllers/reportRequest");

// @route   POST api/createreportrequest
// @desc    create
// @access  Private
router.post(
  "/createreportrequest",
  auth,
  [
    body("vehicleID", "Vehicle Id is required").not().isEmpty(),
    body("startDate", "start date is required").not().isEmpty(),
    body("endDate", " end date is required").not().isEmpty(),
  ],
  reportRequest.createReportRequest
);

// get all report requests by vehicle id
router.get(
  "/getreportrequestbyvehicleId",
  auth,
  reportRequest.getreportRequestsByUserIDandVehicleId
);

router.delete(
  "/deletereportrequest",
  auth,
  reportRequest.deleteRequestsByUserIDandVehicleId
);

module.exports = router;
