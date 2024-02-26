const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
var otpGenerator = require("otp-generator");
const humanizeDuration = require("humanize-duration");

const ServiceCenter = require("../../models/ServiceCenter");

exports.registerServiceCenter = async (req, res) => {
  const errors = validationResult(req);
  console.log("Service Center saving : ");

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const {
      name,
      description,
      category,
      district_id,
      city_id,
      location,
      address,
      email,
      contact_no_1,
      contact_no_mobile,
      longitude,
      latitude,
      businessOpenTime,
      businessCloseTime,
      holidays,
      logoUrl,
      imgUrl,
      businessRegistrationNo,
      premium,
    } = req.body;

    console.log(req.body);

    let openTime = new Date(businessOpenTime).toISOString();
    let closeTime = new Date(businessCloseTime).toISOString();
    let serviceCenter = await ServiceCenter.findOne({
      businessRegistrationNo: businessRegistrationNo,
    });

    console.log("database sc ", serviceCenter);

    if (serviceCenter) {
      console.log("Service Center alrady registered : " + name);
      res
        .status(400)
        .json({ errors: [{ msg: "Service Center alrady registered" }] });
    } else {
      //Add new service center
      serviceCenter = new ServiceCenter({
        name,
        category,
        description,
        district_id,
        city_id,
        address,
        location,
        email,
        contact_no_1,
        contact_no_mobile,
        longitude,
        latitude,
        openTime,
        closeTime,
        holidays,
        logoUrl,
        imgUrl,
        businessRegistrationNo,
        premium,
      });

      console.log(serviceCenter.holidays);
      await serviceCenter.save();

      // indexing database

      // let indexing = await ServiceCenter.createIndex({ location: "2dsphere" });
      // console.log(indexing);

      res.json({ status: "ok" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// register new service type
exports.registerNewServiceType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for service center
    const { serviceoffers } = req.body;
    let serviceCenter = await ServiceCenter.findOne({
      _id: ObjectId(req.user.serviceCenter._id),
    });

    if (!serviceCenter) {
      console.log(
        " There is no service Center : " + req.user.serviceCenter._id
      );

      return res.status(400).json({ msg: "There is no service Center" });
    } else {
      if (
        serviceCenter._id != req.user.serviceCenter._id &&
        req.user.userRole != "Owner"
      ) {
        return res.status(400).json({
          msg: "You are not authorized to add service types to another users service center we are tracking on you ",
        });
      } else {
        // comment this
        serviceCenter.servicesOffered.splice(
          0,
          serviceCenter.servicesOffered.length
        );

        serviceoffers.map((obj, i) => {
          obj.requiredTime = humanizeDuration(
            obj.requiredTimeSlots * 900 * 1000
          );

          console.log(obj);
          serviceCenter.servicesOffered.push(obj);
        });
        serviceCenter.save();

        return res.status(200).json({
          msg: "successfully added new service types to your service center",
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// add new discounts
exports.addrNewDiscount = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for service center
    const { sc_id, discount } = req.body;
    let serviceCenter = await ServiceCenter.findOne({
      _id: ObjectId(req.user.serviceCenter._id),
    });

    if (!serviceCenter) {
      console.log(" There is no service Center for this user : " + sc_id);

      return res
        .status(400)
        .json({ msg: "There is no service Center registerd under you" });
    } else {
      if (req.user.serviceCenter._id != sc_id) {
        return res.status(400).json({
          msg: "You are not authorized to add discount to another users service center we are tracking on you ",
        });
      } else {
        let serviceCenterName = serviceCenter.name;
        discount.map((obj, i) => {
          const discountCode = otpGenerator.generate(4, {
            alphabets: false,
            upperCase: false,
            specialChars: false,
          });
          obj.discountCode = ` ${serviceCenterName}-${discountCode}`;

          serviceCenter.discount.push(obj);
        });

        serviceCenter.save();

        return res.status(200).json({
          msg: "successfully added new Discounts to your service center",
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get service Centers
exports.loadAllSearviceCenters = async (req, res) => {
  console.log("Loading all service centers...");
  try {
    await ServiceCenter.find(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.getallservicetypesbysc_id = async function (req, res) {
  try {
    const sc_id = req.query.sc_id;

    const serviceCenter = await ServiceCenter.findById({
      _id: ObjectId(sc_id),
    });

    if (!serviceCenter) {
      return res.status(400).json({ msg: "There is no service center" });
    } else {
      if (serviceCenter.servicesOffered.length == 0) {
        return res.status(400).json({
          msg: "There is no service types offer by this service center",
        });
      } else {
        return res
          .status(200)
          .json({ servicesOffered: serviceCenter.servicesOffered });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// get service centers by geo location

exports.loadAllSearviceCentersByLocation = async (req, res) => {
  console.log("Loading all service centers...");
  try {
    await ServiceCenter.find(
      {
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [80.39332227997505, 9.268736934950534],
            },
            $minDistance: 100,
            $maxDistance: 50000,
          },
        },
      },
      function (err, result) {
        if (err) return next(err);
        res.json(result);
      }
    );
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// fuel station

exports.updateFuelStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for service center
    const { fuelTypesProvided } = req.body;
    let serviceCenter = await ServiceCenter.findOne({
      _id: ObjectId(req.user.serviceCenter._id),
    });

    if (!serviceCenter) {
      console.log(
        " There is no filling station : " + req.user.serviceCenter._id
      );

      return res.status(404).json({ msg: "There is no filling station" });
    } else {
      if (
        serviceCenter._id != req.user.serviceCenter._id &&
        req.user.userRole != "Owner"
      ) {
        return res.status(400).json({
          msg: "You are not authorized to update  fuel availability od another users filing station we are tracking on you ",
        });
      } else {
        // comment this
        serviceCenter.fuelTypesProvided.splice(
          0,
          serviceCenter.fuelTypesProvided.length
        );

        fuelTypesProvided.map((obj, i) => {
          console.log(obj);
          serviceCenter.fuelTypesProvided.push(obj);
        });
        serviceCenter.save();

        return res.status(200).json({
          msg: "successfully update the fuel status of your filing station",
        });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
