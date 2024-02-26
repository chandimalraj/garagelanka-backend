// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const ServiceType = require("../../models/ServiceType");

exports.loadAllSearviceTypes = async (req, res) => {
  console.log("Loading all service types...");
  try {
    await ServiceType.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerServiceType = async (req, res) => {
  try {
    const { serviceTypeName, colorCode } = req.body;
    console.log("Service Type saving : " + serviceTypeName);

    let serviceType = await ServiceType.findOne({
      serviceTypeName: serviceTypeName,
    });

    if (serviceType) {
      console.log("Service Type already registered : " + serviceTypeName);
      res
        .status(400)
        .json({ errors: [{ msg: "Service Type alrady registered" }] });
    } else {
      //Add new service center
      console.log("Add new Service Type  : " + serviceTypeName);
      serviceType = new ServiceType({
        serviceTypeName,
        colorCode,
      });

      await serviceType.save();

      res.json({ status: "ok" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
