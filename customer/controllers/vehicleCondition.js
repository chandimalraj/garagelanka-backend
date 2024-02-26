// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const VehicleCondition = require("../../models/VehicleCondition");

exports.loadAllVehicleConditions = async (req, res) => {
  console.log("Loading all vehicle Conditions...");
  try {
    await VehicleCondition.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
// vehicle conditions
// add vehicle types

exports.addVehicleCondition = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const vehicleCondition = await VehicleCondition.findOne({
      vehicleCondition: req.body.vehicleCondition,
    });
    if (vehicleCondition) {
      return res.status(400).send("vehicleCondition Already Available");
    } else {
      const newvehicleCondition = new VehicleCondition(req.body);
      const newVehicleConditionSaved = await newvehicleCondition.save();

      res.json({
        data: newVehicleConditionSaved,
        msg: "newvehicleCondition Successfully Added",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
