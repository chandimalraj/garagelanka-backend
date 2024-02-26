// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const VehicleManufacturedYears = require("../../models/VehicleManufacturedYear");

exports.loadAllVehicleManufacturedYears = async (req, res) => {
  console.log("Loading all vehicle Manufactured Years...");
  try {
    await VehicleManufacturedYears.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
// vehicle
// add vehicle types

exports.addVehicleManufacturedYear = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const vehicleManufacturedYear = await VehicleManufacturedYears.findOne({
      year: req.body.year,
    });
    if (vehicleManufacturedYear) {
      return res.status(400).send("vehicleManufacturedYear Already Available");
    } else {
      const newvehicleManufacturedYear = new VehicleManufacturedYears(req.body);
      const newvehicleManufacturedYearSaved =
        await newvehicleManufacturedYear.save();

      res.json({
        data: newvehicleManufacturedYearSaved,
        msg: "vehicleManufacturedYear Successfully Added",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
