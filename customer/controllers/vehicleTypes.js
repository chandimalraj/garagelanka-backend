// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const VehicleType = require("../../models/VehicleTypes");

exports.loadAllVehicleTypes = async (req, res) => {
  console.log("Loading all vehicle types...");
  try {
    await VehicleType.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// add vehicle types

exports.addVehicleType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const vehicleType = await VehicleType.findOne({
      vehicleTypeName: req.body.vehicleTypeName,
    });
    if (vehicleType)
      return res.status(400).send("Vehicle Type Already Available");

    const newvehicleType = new VehicleType(req.body);
    const vehicleTypeSaved = await newvehicleType.save();

    res.json({
      data: vehicleTypeSaved,
      msg: "Vehicle Type Successfully Added",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
