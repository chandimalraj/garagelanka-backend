const path = require("path");
const express = require("express");
const router = express.Router();

const District = require("../../../models/District");

// @route   POST api/generalInfo/districts
// @desc    get all districts
// @access  Public
router.get("/", async (req, res) => {
  console.log("Loading all districts...");
  try {
    await District.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
module.exports = router;
