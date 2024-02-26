const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const serviceCenterController = require("../../controllers/serviceCenter");

// @route   GET /api/serviceCenters.
// @desc    get all service centers
// @access  Private
router.get("/", serviceCenterController.loadAllSearviceCenters);

// @route   GET /api/serviceCenters?serviceTypeId.
// @desc    get all service centers which provide selected service type
// @access  public
router.get(
  "/servicetypeid",
  serviceCenterController.loadAllSearviceCentersWithServiceTypeId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?district_id=mongodbId
// @desc    get all service centers by districtid
// @access  Private
router.get(
  "/serviceCentersByDistrictId",

  serviceCenterController.loadSearviceCentersbyDistrictID
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?district_id=mongodbId
// @desc    get all service centers by districtid
// @access  Private
router.get(
  "/serviceCentersByDistrictIdWithServiceTypeId",

  serviceCenterController.loadSearviceCentersbyDistrictIDWithServiceTypeId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?city_id=1693
// @desc    get all service centers by cityid
// @access  Private
router.get(
  "/serviceCentersByCityId",

  serviceCenterController.loadSearviceCentersbyCityId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?city_id=1693
// @desc    get all service centers by cityid
// @access  Private
router.get(
  "/serviceCentersByCityIdWithServiceTypeId",

  serviceCenterController.loadSearviceCentersbyCityIdWithServiceTypeId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictIdAndCityId?district_id=5&city_id=6
// @desc    get all service centers by districtid and cityId
// @access  Public
router.get(
  "/serviceCentersByDistrictIdAndCityId",
  serviceCenterController.loadSearviceCentersbyDistrictIdAndCityID
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictIdAndCityId?district_id=5&city_id=6
// @desc    get all service centers by districtid and cityId
// @access  Public
router.get(
  "/serviceCentersByDistrictIdAndCityIdWithServiceTypeId",
  serviceCenterController.loadSearviceCentersbyDistrictIdAndCityIDWithServiceTypeId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?district_id=5fe8ea474774f458875db446
// @desc    get all service centers by districtid (Mongo Id)
// @access  Public
router.get(
  "/serviceCentersByDistrict",

  serviceCenterController.loadServiceCentersbyDistrict
);

// @route   GET /api/serviceCenters/serviceCentersByName?name=win
// @desc    get all service centers by name and part of name
// @access  Public
router.get(
  "/serviceCentersByName",
  serviceCenterController.loadServiceCentersbyNamme
);

// @route   GET /api/serviceCenters/serviceCentersByName?name=win
// @desc    get all service if string name is empty centers by name and part of name
// @access  Public
router.get(
  "/serviceCentersByEmptyandName",
  serviceCenterController.loadServiceCentersbyemptyandName
);

// @route   GET /api/serviceCenters/serviceCentersByName?name=win
// @desc    get all service centers by name and part of name
// @access  Public
router.get(
  "/serviceCentersByNameWithServiceTypeId",
  serviceCenterController.loadServiceCentersbyNammeWithServiceTypeId
);

// @route   GET /api/serviceCenters/serviceCentersById?Id=lau
// @desc    get all service centers by name and part of name
// @access  Private
router.get(
  "/serviceCentersById",
  serviceCenterController.loadServiceCentersbyId
);

// @route   POST /api/serviceCenters/registerserviceTypes
// @desc   Register new service types offerd by the service center
// @access  Private
router.post(
  "/registerservicetype",
  auth,
  [
    body("sc_id", "sc_id is required").not().isEmpty(),
    body("serviceoffers", "serviceoffers should be an array").isArray(),

    body("serviceoffers.*.serviceTypeId", "Service Type Id is required")
      .not()
      .isEmpty(),
    body("serviceoffers.*.serviceTypeName", " serviceTypeName is required")
      .not()
      .isEmpty(),
    body("serviceoffers.*.requiredTimeSlots", "requiredTimeSlots is required")
      .not()
      .isEmpty(),
    body(
      "serviceoffers.*.maximumParallel",
      "maximum Parallel slots is required"
    )
      .not()
      .isEmpty(),
  ],
  serviceCenterController.registerNewServiceType
);

// @route   GET/api/serviceCenters/getservicetypesbyscid
// @desc   get all service types offerd by the service center
// @access  Private
router.get(
  "/getservicetypesbyscid",
  serviceCenterController.getallservicetypesbysc_id
);

// @route   GET /api/serviceCenters/geolocation
// @desc    get all service centers with  geo loacation
// @access  Private
router.get(
  "/geolocation",
  auth,
  serviceCenterController.loadAllSearviceCentersByLocation
);

// @route   GET /api/serviceCenters/geolocation
// @desc    get all service centers with  geo loacation
// @access  Private
router.get(
  "/geolocationWithServiceTypeId",
  auth,
  serviceCenterController.loadAllSearviceCentersByLocationWithServiceTypeId
);

// @route   POST/api/serviceCenters/addrating
// @desc   add user ratings to a service center
// @access  Private
router.post(
  "/addrating",
  auth,
  [
    body("sc_id", "sc_id is required").not().isEmpty(),
    body("givenRateing", "given rating is required").not().isEmpty(),
  ],
  serviceCenterController.addRating
);

// filing stations

// @route   GET /api/filingstations.
// @desc    get all filing stations
// @access  Private
router.get("/loadfuelstations", serviceCenterController.loadAllfilingstations);

router.get(
  "/findfillingstationsgeolocation",
  auth,
  serviceCenterController.loadAllFillingStationsByLocation
);

router.get(
  "/loadfuelstationswithfueltype",
  serviceCenterController.loadAllfilingstationsWithFuelTypeId
);

// @route   GET /api/serviceCenters/geolocation
// @desc    get all service centers with  geo loacation
// @access  Private
router.get(
  "/geolocationloadfuelstationswithfueltype",
  auth,
  serviceCenterController.loadAllfilingstationsByLocationWithFuelTypeId
);
module.exports = router;
