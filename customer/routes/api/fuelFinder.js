const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const fuelFinderController = require("../../controllers/fuelFinder");

// filing stations

// @route   GET /api/filingstations.
// @desc    get all filing stations
// @access  Private
router.get("/loadfuelstations", fuelFinderController.loadAllfilingstations);

router.get(
  "/findfillingstationsgeolocation",
  fuelFinderController.loadAllFillingStationsByLocation
);

router.get(
  "/loadfuelstationswithfueltype",
  fuelFinderController.loadAllfilingstationsWithFuelTypeId
);

// @route   GET /api/serviceCenters/geolocation
// @desc    get all service centers with  geo loacation
// @access  Private
router.get(
  "/geolocationloadfuelstationswithfueltype",
  fuelFinderController.loadAllfilingstationsByLocationWithFuelTypeId
);

// @route   POST api/fuelstation/updatefuelavailability
// @desc    Update fuel availability
// @access  Private
router.post(
  "/updatefuelstation",
  auth,
  [
    body("fuelTypesProvided", "fuelTypesProvided is required").isArray(),
    body("open", " fuel station open or close is required").exists(),
    body("queue", "queue size is required").exists(),
    body("_id", "_id is required").exists(),
  ],

  fuelFinderController.updateFuelstationByCostomer
);
module.exports = router;
