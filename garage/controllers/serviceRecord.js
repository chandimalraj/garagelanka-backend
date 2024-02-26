// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const ServiceRecord = require("../../models/ServiceRecord");
const Booking = require("../../models/Bookings");
const ServiceCenter = require("../../models/ServiceCenter");
const Vehicle = require("../../models/Vehicle");

const utils = require("./utils/addServiceRecords");

exports.addServiceRecord = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Add service record to DB
    utils.addServiceRecord(req, res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//get service records for perticular vehicle(vehicle id)

exports.getServiceRecordsByVehicleId = async function (req, res) {
  try {
    const vehicle_id = req.params.id;

    // test with not allowed user
    // req.user.serviceCenterID = "608033fd1e33d634c8175f45"

    const user = req.user;

    const vehicle = await Vehicle.findById(vehicle_id);

    let allowView = false;

    for (let a of vehicle.allow) {
      if (a.serviceCenterId == user.serviceCenterID) {
        allowView = true;
        break;
      } else {
        allowView = false;
      }
    }

    if (allowView == false) {
      return res.status(404).json({ msg: "Access Denied" });
    }

    const serviceRecords = await ServiceRecord.find({
      vehicle: vehicle_id,
    })
      .populate("bookingId", Booking)
      .populate("service_center_id", ServiceCenter)
      .populate("vehicle", Vehicle);

    if (serviceRecords.length == 0)
      return res.status(400).json({ msg: "No service records found" });

    return res.status(200).json({ serviceRecords });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.getServiceRecordsByVehicleNo = async function (req, res) {
  try {
    const vehicleId = req.params.vehicleId;

    // test with not allowed user
    // req.user.serviceCenterID = "608033fd1e33d634c8175f45"

    const user = req.user;

    const vehicle = await Vehicle.findOne({ vehicleId });

    let allowView = false;

    for (let a of vehicle.allow) {
      if (a.serviceCenterId == user.serviceCenterID) {
        allowView = true;
        break;
      } else {
        allowView = false;
      }
    }

    // if (allowView == false) {
    //   return res.status(404).json({ msg: "Access Denied" });
    // }

    const serviceRecords = await ServiceRecord.find({
      vehicle: vehicle._id,
    })
      .populate("bookingId", Booking)
      .populate("service_center_id", ServiceCenter)
      .populate("vehicle", "-allow");

    if (serviceRecords.length == 0)
      return res.status(400).json({ msg: "No service records found" });

    return res.status(200).json({ serviceRecords });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
