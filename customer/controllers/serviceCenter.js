const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const ServiceCenter = require("../../models/ServiceCenter");

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

exports.loadAllSearviceCenters = async (req, res) => {
  console.log("Loading all service centers...");
  try {
    //  pagination
    let limit = 10;
    let page = 1;

    console.log("req", req.query);
    // let condition =

    // set the page number
    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number should be greater than or equal 1" });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }

      // set the offset

      const offset = await (limit * (page - 1));
      const serviceCenters = await ServiceCenter.paginate(
        {},
        { offset: offset, limit: limit }
      );

      if (serviceCenters.length == 0) {
        return res.status(404).json({ msg: "There is no service centers" });
      } else {
        return res.status(200).json({ serviceCenters });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// Load all service centers with service type id

exports.loadAllSearviceCentersWithServiceTypeId = async (req, res) => {
  serviceTypeId = req.query.serviceTypeId;

  console.log(
    "Loading all service centers with service type id...",
    serviceTypeId
  );
  try {
    await ServiceCenter.find(
      {
        servicesOffered: {
          $elemMatch: { serviceTypeId: serviceTypeId },
        },
      },
      function (err, result) {
        console.log(result);
        if (err) return next(err);
        res.json(result);
      }
    );
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

// Load all service Centers by district Id and Provided service Types

exports.loadSearviceCentersbyDistrictIDWithServiceTypeId = async function (
  req,
  res,
  next
) {
  serviceTypeId = req.query.serviceTypeId;
  try {
    console.log(
      "Loading service centers by district :" + req.query.district_id
    );
    const district_id = req.query.district_id;
    await ServiceCenter.find(
      {
        district_id: district_id,
        servicesOffered: {
          $elemMatch: { serviceTypeId: serviceTypeId },
        },
      },

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
    await ServiceCenter.find(
      { city_id: ObjectId(city_id) },
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

exports.loadSearviceCentersbyCityIdWithServiceTypeId = async function (
  req,
  res,
  next
) {
  serviceTypeId = req.query.serviceTypeId;
  try {
    console.log("Loading service centers by city :" + req.query.city_id);
    const city_id = req.query.city_id;
    await ServiceCenter.find(
      {
        city_id: ObjectId(city_id),
        servicesOffered: {
          $elemMatch: { serviceTypeId: serviceTypeId },
        },
      },
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

exports.loadSearviceCentersbyDistrictIdAndCityIDWithServiceTypeId =
  async function (req, res, next) {
    serviceTypeId = req.query.serviceTypeId;
    try {
      console.log("Loading district with DistrictId:" + req.query.district_id);
      console.log("Loading district with CityId:" + req.query.city_id);
      const district_id = req.query.district_id;
      const city_id = req.query.city_id;
      await ServiceCenter.find(
        {
          district_id: ObjectId(district_id),
          city_id: ObjectId(city_id),
          servicesOffered: {
            $elemMatch: { serviceTypeId: serviceTypeId },
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
// load service center initially all and then by name

exports.loadServiceCentersbyemptyandName = async function (req, res, next) {
  try {
    console.log("Loading service center by Name :" + req.query.name);
    let name = "";

    if (req.query.name != null) {
      name = req.query.name;
    }

    if (name.length == 0) {
      await ServiceCenter.find(function (err, result) {
        if (err) return next(err);
        res.json(result);
      });
    } else {
      await ServiceCenter.find(
        { name: { $regex: "^" + name, $options: "i" } },
        function (err, result) {
          if (err) return next(err);
          res.json(result);
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.loadServiceCentersbyNammeWithServiceTypeId = async function (
  req,
  res,
  next
) {
  serviceTypeId = req.query.serviceTypeId;
  try {
    console.log("Loading service center by Name :" + req.query.name);
    const name = req.query.name;
    await ServiceCenter.find(
      {
        name: { $regex: "^" + name, $options: "i" },
        servicesOffered: {
          $elemMatch: { serviceTypeId: serviceTypeId },
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
// register new service type
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

// get service centers by geo location

exports.loadAllSearviceCentersByLocation = async (req, res) => {
  console.log("Loading all service centers of geo location...");

  const longitude = req.query.longitude;
  const latitude = req.query.latitude;

  try {
    await ServiceCenter.find(
      {
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $minDistance: 0,
            $maxDistance: 10000,
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

// get service centers by geo location and service type id
exports.loadAllSearviceCentersByLocationWithServiceTypeId = async (
  req,
  res
) => {
  console.log("Loading all service centers of geo location...");

  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  serviceTypeId = req.query.serviceTypeId;

  try {
    await ServiceCenter.find(
      {
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $minDistance: 0,
            $maxDistance: 10000,
          },
        },

        servicesOffered: {
          $elemMatch: { serviceTypeId: serviceTypeId },
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

// filing stations

exports.loadAllfilingstations = async (req, res) => {
  console.log("Loading all filing stations ...");
  try {
    await ServiceCenter.find(
      { category: "FilingStation" },
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

exports.loadAllFillingStationsByLocation = async (req, res) => {
  console.log("Loading all service centers of geo location...");

  const longitude = req.query.longitude;
  const latitude = req.query.latitude;

  try {
    await ServiceCenter.find(
      {
        category: "FilingStation",
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $minDistance: 0,
            $maxDistance: 10000,
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

exports.loadAllfilingstationsWithFuelTypeId = async (req, res) => {
  fuelTypeId = req.query.fuelTypeId;

  console.log("Loading all filing stations with fuel type id", fuelTypeId);
  try {
    await ServiceCenter.find(
      {
        category: "FilingStation",
        fuelTypesProvided: {
          $elemMatch: { fuelTypeId: fuelTypeId, availability: true },
        },
      },
      function (err, result) {
        console.log(result);
        if (err) return next(err);
        res.json(result);
      }
    );
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
    await ServiceCenter.find(
      {
        category: "FilingStation",
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $minDistance: 0,
            $maxDistance: 10000,
          },
        },
        fuelTypesProvided: {
          $elemMatch: { fuelTypeId: fuelTypeId, availability: true },
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
