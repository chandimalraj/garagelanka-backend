const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const ServiceCenter = require("../../models/ServiceCenter");
const moment = require("moment-timezone");
const User = require("../../models/GarageUser");

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
      category,
      description,
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
      owner_id,
    } = req.body;

    // console.log(req.body);

    // set the time zone
    console.log("owner id", owner_id);
    moment().tz("Asia/Colombo");

    let openTime = moment(new Date(businessOpenTime)).toISOString(true);
    let closeTime = moment(new Date(businessCloseTime)).toISOString(true);

    // console.log("open time ", openTime);
    // console.log("close time ", closeTime);

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
        openTime,
        closeTime,
        holidays,
        logoUrl,
        imgUrl,
        businessRegistrationNo,
        premium,
        owner_id,
      });

      console.log(serviceCenter.holidays);
      let service_center_data = await serviceCenter.save();
      // console.log(service_center_data);

      // update user's sercice center id
      User.findByIdAndUpdate(
        owner_id,
        { serviceCenterID: service_center_data._id },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated User : ", data);
          }
        }
      );

      // indexing database

      // let indexing = await ServiceCenter.createIndex({ location: "2dsphere" });
      // console.log(indexing);

      res.json({ status: "Service Center Saved Successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.addunregisteredServiceCenter = async (req, res) => {
  const errors = validationResult(req);
  console.log("Service Center saving : ");

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const {
      name,
      category,
      district_id,
      city_id,
      location,
      address,
      email,
      contact_no_1,
      contact_no_mobile,
      logoUrl,
      imgUrl,
      businessRegistrationNo,
    } = req.body;

    console.log(req.body);

    let serviceCenter = await ServiceCenter.findOne({
      name: contact_no_1,
      name: name,
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
        district_id,
        city_id,
        address,
        location,
        email,
        contact_no_1,
        contact_no_mobile,
        logoUrl,
        imgUrl,
        garegeLankaRegistered: false,
        businessRegistrationNo,
      });

      await serviceCenter.save();

      res
        .status(200)
        .json({ status: "Unregistered Service Center Saved Successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadServiceCentersbyDistrict = async function (req, res) {
  try {
    console.log(
      "Loading service centers by district id (mongo Id) :" +
        req.query.district_id
    );
    const district_id = req.query.district_id;

    const serviceCenters = await ServiceCenter.find(
      { district_id: district_id },
      function (err, result) {
        if (err) return next(err);
        res.status(200).json(result);
      }
    );

    console.log(serviceCenters);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// register filing station

exports.registerFilinstation = async (req, res) => {
  const errors = validationResult(req);
  console.log("Service Center saving : ");

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const {
      name,
      category,
      district_id,
      city_id,
      location,
      address,
      contact_no_1,

      businessRegistrationNo,
    } = req.body;

    // console.log(req.body);

    // set the time zone

    let serviceCenter = await ServiceCenter.findOne({
      businessRegistrationNo: businessRegistrationNo,
    });

    console.log("database sc ", serviceCenter);

    if (serviceCenter) {
      console.log("Filing station alrady registered : " + name);
      res
        .status(400)
        .json({ errors: [{ msg: "Filing station alrady registered" }] });
    } else {
      //Add new service center
      serviceCenter = new ServiceCenter({
        name,
        category,
        district_id,
        city_id,
        address,
        location,

        contact_no_1,

        businessRegistrationNo,
      });

      console.log(serviceCenter.holidays);
      await serviceCenter.save();

      // indexing database

      // let indexing = await ServiceCenter.createIndex({ location: "2dsphere" });
      // console.log(indexing);

      res.json({ status: "Filing Station Saved Successfully" });
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

exports.loadSearviceCentersbyDistrictID = async function (req, res, next) {
  try {
    console.log(
      "Loading service centers by district :" + req.query.district_id
    );
    const district_id = req.query.district_id;
    await ServiceCenter.find(
      { district_id: district_id },
      function (err, result) {
        if (err) return next(err);
        res.status(200).json(result);
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadSearviceCentersbyCityId = async function (req, res, next) {
  try {
    console.log("Loading service centers by city :" + req.query.city_id);
    const city_id = req.query.city_id;
    await ServiceCenter.find({ city_id: city_id }, function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.loadSearviceCentersbyDistrictIdAndCityID = async function (
  req,
  res,
  next
) {
  try {
    console.log("Loading district with DistrictId:" + req.query.district_id);
    console.log("Loading district with CityId:" + req.query.city_id);
    const district_id = req.query.district_id;
    const city_id = req.query.city_id;
    await ServiceCenter.find(
      {
        district_id: ObjectId(district_id),
        city_id: ObjectId(city_id),
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

exports.loadServiceCentersbyNamme = async function (req, res, next) {
  try {
    console.log("Loading service center by Name :" + req.query.name);
    const name = req.query.name;
    await ServiceCenter.find(
      { name: { $regex: "^" + name, $options: "i" } },
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

exports.loadServiceCentersbyId = async function (req, res, next) {
  try {
    console.log("Loading service center by Id :" + req.query.Id);
    const Id = req.query.Id;
    const serviceCenter = await ServiceCenter.find(
      { _id: Id },
      {
        name: 1,
        district_id: 1,
        city_id: 1,
        address: 1,
        longitude: 1,
        latitude: 1,
        holidays: 1,
        premium: 1,
      }
    );
    console.log(serviceCenter);

    res.json(serviceCenter);
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
// register new service type to service center
exports.registerNewServiceType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for service center
    const { sc_id, serviceoffers } = req.body;
    let serviceCenter = await ServiceCenter.findOne({ _id: ObjectId(sc_id) });

    if (!serviceCenter) {
      console.log(" There is no service Center for this user : " + sc_id);

      return res
        .status(400)
        .json({ msg: "There is no service Center registerd under you" });
    } else {
      if (serviceCenter.owner_id != req.user.id) {
        return res.status(400).json({
          msg: "You are not authorized to add service types to another users service center we are tracking on you ",
        });
      } else {
        serviceoffers.map((obj, i) => {
          console.log("serviceId", obj.serviceId);
          console.log("serviceTypeName", obj.serviceTypeName);
          console.log("requiredTimeSlots", obj.requiredTimeSlots);

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

// add ratings to a service center
exports.addRating = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for service center
    const { sc_id, givenRateing } = req.body;
    let serviceCenter = await ServiceCenter.findOne({ _id: ObjectId(sc_id) });

    if (!serviceCenter) {
      console.log(" There is no service Center " + sc_id);

      return res.status(400).json({ msg: "There is no service Center" });
    } else {
      serviceCenter.rating.properties.rate =
        (serviceCenter.rating.properties.rate *
          serviceCenter.rating.properties.NumberOfRatings +
          givenRateing) /
        (serviceCenter.rating.properties.NumberOfRatings + 1);

      serviceCenter.rating.properties.NumberOfRatings += 1;
      await serviceCenter.save();

      return res.status(200).json({
        msg: "successfully added ratings to the service center",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
