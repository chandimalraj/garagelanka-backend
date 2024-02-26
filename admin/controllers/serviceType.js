// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const ServiceType = require("../../models/ServiceType");

// load all service types
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

// register new service type

exports.registerServiceType = async (req, res) => {
  try {
    const { serviceTypeName, serviceTypeimageURL, colorCode } = req.body;
    console.log("Service Type saving : " + serviceTypeName);

    let serviceType = await ServiceType.findOne({
      serviceTypeName: serviceTypeName,
    });

    let serviceTypeColorCode = await ServiceType.findOne({
      colorCode: colorCode,
    });

    if (serviceType) {
      console.log("Service Type already registered : " + serviceTypeName);
      res
        .status(400)
        .json({ errors: [{ msg: "Service Type alrady registered" }] });
    }

    if (serviceTypeColorCode) {
      console.log(
        "Service Type color code already registered : " + serviceTypeName
      );
      res.status(400).json({
        errors: [
          {
            msg: "Color code is alrady used please use a different color code ",
          },
        ],
      });
    } else {
      //Add new service type
      console.log("Add new Service Type  : " + serviceTypeName);
      serviceType = new ServiceType({
        serviceTypeName,
        colorCode,
        serviceTypeimageURL,
      });

      await serviceType.save();

      res.json({ status: "ok" });
    }
    8;
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
