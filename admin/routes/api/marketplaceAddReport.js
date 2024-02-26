const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
// bring booking controller
const marketplaceAddReport = require("../../controllers/marketplaceAddReports");

// @route   POST api/addreports/addcpmplaine
// @desc    make a advertestment complain
// @access  Private
router.post(
  "/addcpmplaine",
  [
    body("merketPlaceAddID", "merketPlaceAddID is required").not().isEmpty(),
    body("Description", "Description is required").not().isEmpty(),
  ],
  marketplaceAddReport.createAddReport
);

module.exports = router;
