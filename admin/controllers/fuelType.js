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

exports.registerFuelType = async (req, res) => {
  try {
    const { fuelTypeName, fuelTypeimageURL } = req.body;
    console.log("Fuel Type saving : " + fuelTypeName);

    let fuelType = await FuelType.findOne({
      fuelTypeName: fuelTypeName,
    });

    if (fuelType) {
      console.log("Service Type already registered : " + fuelTypeName);
      res
        .status(400)
        .json({ errors: [{ msg: "Service Type alrady registered" }] });
    } else {
      //Add new service type
      console.log("Add Fuel Type  : " + fuelTypeName);
      fuelType = new FuelType({
        fuelTypeName,
        fuelTypeimageURL,
      });

      await fuelType.save();

      res.json({ status: "fuel type successfully registed" });
    }
    8;
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
