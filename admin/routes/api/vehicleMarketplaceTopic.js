const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const marketplaceTopic = require("../../controllers/marketplaceTopics");

// filing stations

// // @route   GET /api/filingstations.
// // @desc    get all filing stations
// // @access  Private
// router.get("/loadfuelstations", fuelFinderController.loadAllfilingstations);

// router.get(
//   "/findfillingstationsgeolocation",
//   fuelFinderController.loadAllFillingStationsByLocation
// );

// router.get(
//   "/loadfuelstationswithfueltype",
//   fuelFinderController.loadAllfilingstationsWithFuelTypeId
// );

// // @route   GET /api/serviceCenters/geolocation
// // @desc    get all service centers with  geo loacation
// // @access  Private
// router.get(
//   "/geolocationloadfuelstationswithfueltype",
//   fuelFinderController.loadAllfilingstationsByLocationWithFuelTypeId
// );

// @route   POST api/fuelstation/updatefuelavailability
// @desc    Update fuel availability
// @access  Private
router.post(
  "/subscribe",
  auth,
  [
    body("make", "make is required").exists(),
    body("makeName", " makeName is required").exists(),
    body("model", "model is required").exists(),
    body("modelName", "modelName is required").exists(),
    body("firebaseId", "firebaseId is required").exists(),
  ],

  marketplaceTopic.subscribeToTopic
);
module.exports = router;
