const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

const Make = require("../../../models/Make");
// bring vehicle controller
const makeController = require("../../controllers/make");
// @route   POST api/generalInfo/districts
// @desc    get all districts
// @access  Public
router.get("/", auth, async (req, res) => {
  console.log("Loading all makes...");
  try {
    await Make.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.post(
  "/makelist",
  [
    body("make_id", "make id is required").not().isEmpty(),
    body("name_en", "name in eng is required").not().isEmpty(),
  ],
  makeController.registermake
);

module.exports = router;
