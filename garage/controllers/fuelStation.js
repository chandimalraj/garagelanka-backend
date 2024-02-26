const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");

const User = require("../../models/FillingStation");
const FuelType = require("../../models/FuelTypes");

// Register User
exports.registerFuelStation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mobile, password, latitude, longitude } = req.body;
  const newuser = req.body;
  newuser.fuelTypesProvided = [];
  newuser.userRole = "FuelStation";

  if (longitude && latitude)
    newuser.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (user) {
      res.status(400).json({
        errors: [
          {
            msg: "Filing Station alrady exsist mobile number alrady registerd",
          },
        ],
      });
    } else {
      //  add filing types to filing station
      console.log("Loading all fuel types...");
      try {
        const fueltypes = await FuelType.find();

        await fueltypes.map((obj, i) => {
          newuser.fuelTypesProvided.push(obj);
        });
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error in fuael type mapping");
      }

      user = new User(newuser);

      // Encrypth the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save the user to database
      await user.save();

      // Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
          userRole: user.userRole,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000,
        },
        (error, token) => {
          if (error) throw err;
          res.json({ token });
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.updateFuelType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { fuelTypesProvided, open, lastUpdateTime } = req.body;

  try {
    let user = await User.findById(req.user.id);

    // comment this
    user.fuelTypesProvided.splice(0, user.fuelTypesProvided.length);
    user.fuelTypesProvided = fuelTypesProvided;
    user.open = open;
    user.lastUpdateTime = lastUpdateTime;
    user.lastUpdate = Date.now();

    await user.save();

    res.status(200).send("Fuel availability updated successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadAllFuelTypesProvidedByFuelStationId = async (req, res) => {
  console.log("Loading all fuel types...");
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ msg: "No fuel station found" });
    }

    res.status(200).json({
      open: user.open,
      fuelTypesProvided: user.fuelTypesProvided,
      StationName: user.StationName,
      address: user.address,
      phone: user.mobile,
      status: user.status,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
