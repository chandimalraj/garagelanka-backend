const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const Model = require("../../models/Model");
// bring model controller
const modelController = require("../../controllers/model");

const auth = require("../../middleware/auth");
// @route   POST api/models
// @desc    get all models
// @access  Public
// Add models...
router.get("/", async (req, res) => {
  console.log("Loading all models...");
  try {
    await Model.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/modelBymakeId
// @desc    get all models by make id
// @access  Public
router.get("/modelBymakeId", async function (req, res, next) {
  try {
    console.log("Loading models with make id:" + req.query.make_id);
    const make_id = req.query.make_id;
    await Model.find({ make_id: make_id }, function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

// @route POST api / models
// @desc Register models
// @access Private
router.post(
  "/modellist",
  [
    body("make_id", "make id is required").not().isEmpty(),
    body("model_id", "name in eng is required").not().isEmpty(),
    body("name_en", "name in eng is required").not().isEmpty(),
  ],
  modelController.registermodel
);

module.exports = router;
