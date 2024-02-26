const path = require("path");
const express = require("express");
const router = express();

// @route   GET /api/host
// @desc    get lankahost route
// @access  Public
router.get("/", async (req, res) => {
  try {
    console.log("hosting route working");
    res.send("Server route is working");
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

module.exports = router;
