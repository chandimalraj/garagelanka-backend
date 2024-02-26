const path = require("path");
const express = require("express");
const router = express();
var ObjectId = require("mongodb").ObjectID;
const City = require("../../../models/City");

const citiesController = require("../../controllers/districtsandcities");

// @route   GET /api/cities
// @desc    get all cities in SriLanka
// @access  Public
router.get("/", async (req, res) => {
  try {
    await City.find(function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

// @route   GET /api/cities/citiesByDistrictId?district_id=7
// @desc    get all cities by district_id
// @access  Public
router.get("/citiesByDistrictId", async function (req, res, next) {
  try {
    console.log("Loading district with id:" + req.query.district_id);
    const district_id = req.query.district_id;
    await City.find({ district_id: district_id }, function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
});

// @route   GET /api/cities/citiesByDistrictIdCityName?district_id=7&cityName=Ak
// @desc    get all cities by districtid and cityName(full or partially)
// @access  Public
router.get("/citiesByDistrictIdCityName", async function (req, res, next) {
  try {
    console.log("Loading district with id:" + req.query.district_id);
    console.log("Loading district with CityNameString:" + req.query.cityName);
    const district_id = req.query.district_id;
    const cityNameString = req.query.cityName;
    await City.find(
      {
        district_id: district_id,
        name_en: { $regex: "^" + cityNameString, $options: "i" },
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
});

module.exports = router;
