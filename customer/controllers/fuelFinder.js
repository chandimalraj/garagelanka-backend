const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");
var ObjectId = require("mongodb").ObjectID;

const FuelStation = require("../../models/FillingStation");
const User = require("../../models/User");
const FuelType = require("../../models/FuelTypes");

exports.loadAllFuelTypesProvidedByFuelStationId = async (req, res) => {
  console.log("Loading all fuel types...");
  try {
    let fuelStation = await FuelStation.findById(id);
    if (!fuelStation) {
      res.status(404).json({ msg: "No fuel station found" });
    }

    res.status(200).json({ fuelTypesProvided: fuelStation.fuelTypesProvided });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// filing stations

exports.loadAllfilingstations = async (req, res) => {
  console.log("Loading all filing stations ...");
  try {
    const fuelStations = await FuelStation.find(
      {
        $and: [{ status: "Live" }, { registeredMethod: "By Station" }],
      },
      { password: 0, status: 0, resetString: 0, nic: 0, password: 0, date: 0 }
    );

    const unFuelStations = await FuelStation.find(
      {
        $and: [{ status: "Live" }, { registeredMethod: "ByAdmin" }],
      },
      { password: 0, status: 0, resetString: 0, nic: 0, password: 0, date: 0 }
    );

    // if (fuelStations.length == 0)
    //   res.status(404).json({ msg: "No Fuel Stations Found" });

    console.log("unregisterd fuel stations", unFuelStations);

    res
      .status(200)
      .json({ FuelStations: fuelStations, Unregisterd: unFuelStations });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.loadAllFillingStationsByLocation = async (req, res) => {
  console.log("Loading all service centers of geo location...");

  const longitude = req.query.longitude;
  const latitude = req.query.latitude;

  try {
    const fuelStations = await FuelStation.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $minDistance: 100,
          $maxDistance: 10000,
        },
      },
    });

    if (fuelStations.length == 0)
      res.status(404).json({ msg: "No Fuel Stations Found" });
    res.status(200).json({ FuelStations: fuelStations });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.loadAllfilingstationsWithFuelTypeId = async (req, res) => {
  fuelTypeId = req.query.fuelTypeId;

  console.log("Loading all filing stations with fuel type id", fuelTypeId);
  try {
    const fuelStations = await FuelStation.find(
      {
        $and: [
          { status: "Live" },
          { registeredMethod: "By Station" },
          {
            fuelTypesProvided: {
              $elemMatch: {
                $and: [{ _id: fuelTypeId, availability: true }],
              },
            },
          },
        ],
      },
      { password: 0, status: 0, resetString: 0, nic: 0, password: 0, date: 0 }
    );

    const unFuelStations = await FuelStation.find(
      {
        $and: [
          { status: "Live" },
          { registeredMethod: "ByAdmin" },
          {
            fuelTypesProvided: {
              $elemMatch: {
                $and: [{ _id: fuelTypeId, availability: true }],
              },
            },
          },
        ],
      },
      { password: 0, status: 0, resetString: 0, nic: 0, password: 0, date: 0 }
    );

    // Madushan asked for empty list insted of 404

    // if (fuelStations.length == 0)
    //   res.status(404).json({ msg: "No Fuel Stations Found" });
    res
      .status(200)
      .json({ FuelStations: fuelStations, Unregisterd: unFuelStations });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.loadAllfilingstationsByLocationWithFuelTypeId = async (req, res) => {
  console.log("Loading all filing stations with fuel type id and geo location");

  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  fuelTypeId = req.query.fuelTypeId;

  try {
    const fuelStations = await FuelStation.find(
      {
        $and: [
          { status: "Live" },
          { open: true },
          {
            location: {
              $nearSphere: {
                $geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                $minDistance: 0,
                $maxDistance: 100000,
              },
            },
          },
          {
            fuelTypesProvided: {
              $elemMatch: { _id: fuelTypeId, availability: true },
            },
          },
        ],
      },
      { password: 0, status: 0, resetString: 0, nic: 0, password: 0, date: 0 }
    );

    if (fuelStations.length == 0)
      res.status(404).json({ msg: "No Fuel Stations Found" });
    res.status(200).json({ FuelStations: fuelStations });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// update fuel station by customer

exports.updateFuelstationByCostomer = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // see if user exixts
  let user = await User.findOne({ _id: ObjectId(req.user.id) });
  if (!user) {
    console.log("There is no user");
    res
      .status(400)
      .json({ errors: [{ msg: "There is no user register again" }] });
  } else {
    const currentTime = Date.now();

    if (user.lastFuelStationUpdateTime == null) {
      user.lastFuelStationUpdateTime = new Date("10/25/2021");
    }
    let diffInMilliSeconds =
      Math.abs(currentTime - user.lastFuelStationUpdateTime) / 1000;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    console.log("minutes", minutes);

    if (minutes < 15 && user.stationUpdateCount >= 2) {
      res.status(400).json({
        errors: [
          {
            msg: `You can edit only 2  stations within 15 min try again in ${
              15 - minutes
            } minutes`,
          },
        ],
      });
    } else {
      let { fuelTypesProvided, open, queue, _id } = req.body;

      let fuelStation = await FuelStation.findById(_id);
      if (!fuelStation) {
        res.status(404).json({ msg: "No fuel station found" });
      } else {
        try {
          // comment this
          fuelStation.fuelTypesProvided.splice(
            0,
            fuelStation.fuelTypesProvided.length
          );

          if (fuelTypesProvided) {
            fuelStation.fuelTypesProvided = fuelTypesProvided;
          }
          if (open) {
            fuelStation.open = open;
          }
          if (queue) {
            fuelStation.queue = queue;
          }

          fuelStation.lastUpdate = Date.now();

          await fuelStation.save();

          if (user.stationUpdateCount == 2) {
            user.stationUpdateCount = 1;
          } else {
            user.stationUpdateCount = user.stationUpdateCount + 1;
          }

          user.lastFuelStationUpdateTime = Date.now();

          await user.save();
          res
            .status(200)
            .send("Fuel availability updated successfully by User");
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Server error");
        }
      }
    }
  }
};
