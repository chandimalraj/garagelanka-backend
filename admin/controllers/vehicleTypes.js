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

exports.registerVehicleType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { VehicleTypeName } = req.body;

    let vehicleType = await VehicleType.findOne({
      VehicleTypeName: VehicleTypeName,
    });

    if (vehicleType) {
      console.log("Vehicle Type already registered : " + serviceTypeName);
      res
        .status(400)
        .json({ errors: [{ msg: "Vehicle Type alrady registered" }] });
    } else {
      //Add new service type
      console.log("Add new Vehicle Type  : " + VehicleTypeName);
      vehicleType = new ServiceType({
        VehicleTypeName,
      });

      await vehicleType.save();

      res.status(200).json({ msg: "Vehicle Type registered successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
