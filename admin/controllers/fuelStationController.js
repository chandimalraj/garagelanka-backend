const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");

const FuelStation = require("../../models/FillingStation");
const FuelType = require("../../models/FuelTypes");

exports.updateFuelStation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { fuelStationId, district_id, city_id, location, status, open, suburb } =
    req.body;

  // console.log("longitude", location.coordinates[0]);
  // console.log("latitude", location.coordinates[1]);

  try {
    let fuelStation = await FuelStation.findById(fuelStationId);

    if (status) fuelStation.status = status;
    if (open) fuelStation.open = open;
    if (district_id) fuelStation.district_id = district_id;
    if (city_id) fuelStation.city_id = city_id;
    if (location) {
      fuelStation.location = location;
      fuelStation.longitude = location.coordinates[0];
      fuelStation.latitude = location.coordinates[1];
    }
    if (suburb) fuelStation.suburb = suburb;

    console.log("longitude", fuelStation.longitude);
    console.log("latitude", fuelStation.latitude);

    await fuelStation.save();

    res
      .status(200)
      .send(`Fuel station status updated to ${status} successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadAllFualStations = async (req, res) => {
  console.log("Loading all fuel types...");
  try {
    let { status, mobile, nic } = req.body;
    let fuelStations = await FuelStation.find({
      $or: [{ status: status }, { mobile: mobile }, { nic: nic }],
    });
    if (fuelStations.length == 0) {
      res.status(404).json({ msg: "No fuel station found" });
    }

    res.status(200).json({ fuelStations: fuelStations });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Register unregisterd fuel stations

exports.registerUnregisterdFuelStation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    StationName,
    mobile,
    password,
    district_id,
    city_id,
    location,
    status,
    open,
    suburb,
  } = req.body;
  const newFuelStation = {};
  newFuelStation.fuelTypesProvided = [];
  newFuelStation.userRole = "FuelStation";

  try {
    // see if user exixts
    let fuelStation = await FuelStation.findOne({ mobile: mobile });

    if (fuelStation) {
      res.status(400).json({
        errors: [
          {
            msg: "Filing Station alrady exsist mobile number alrady registerd",
          },
        ],
      });
    } else {
      if (StationName) newFuelStation.StationName = StationName;
      if (mobile) newFuelStation.mobile = mobile;
      if (status) newFuelStation.status = status;
      if (open) newFuelStation.open = open;
      if (district_id) newFuelStation.district_id = district_id;
      if (city_id) newFuelStation.city_id = city_id;
      if (location) {
        newFuelStation.location = location;
        newFuelStation.longitude = location.coordinates[0];
        newFuelStation.latitude = location.coordinates[1];
      }
      if (suburb) newFuelStation.suburb = suburb;

      //  add filing types to filing station
      console.log("Loading all fuel types...");
      try {
        const fueltypes = await FuelType.find();

        await fueltypes.map((obj, i) => {
          newFuelStation.fuelTypesProvided.push(obj);
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error in fuael type mapping");
      }

      fuelst = new User(newFuelStation);

      // Encrypth the password
      const salt = await bcrypt.genSalt(10);
      fuelst.password = await bcrypt.hash(password, salt);

      // save the registerd method

      fuelst.registeredMethod = "ByAdmin";

      // save the user to database
      await fuelst.save();

      res.status(500).json({ msg: "new fuel station registerd successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
