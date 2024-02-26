// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const FuelType = require("../../models/FuelTypes");

exports.loadAllFuelTypes = async (req, res) => {
  console.log("Loading all fuel types...");
  try {
    await FuelType.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
