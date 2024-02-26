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

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?district_id=5
// @desc    get all service centers by districtid
// @access  Private
router.get(
  "/serviceCentersByDistrictId",

  serviceCenterController.loadSearviceCentersbyDistrictID
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictId?city_id=1693
// @desc    get all service centers by cityid
// @access  Private
router.get(
  "/serviceCentersByCityId",

  serviceCenterController.loadSearviceCentersbyCityId
);

// @route   GET /api/serviceCenters/serviceCentersByDistrictIdAndCityId?district_id=5&city_id=6
// @desc    get all service centers by districtid and cityId
// @access  Public
router.get(
  "/serviceCentersByDistrictIdAndCityId",
  serviceCenterController.loadSearviceCentersbyDistrictIdAndCityID
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

router.post(
  "/",
  auth,
  [
    body("name", "name is required").not().isEmpty(),
    body("district_id", "district is required").not().isEmpty(),
    body("city_id", "city is required").not().isEmpty(),
    body("address", "address is required").not().isEmpty(),

    body("email", "email is required").not().isEmpty(),
    body("contact_no_1", "contact_no_1").not().isEmpty(), //owner
    body("contact_no_mobile", "contact_no_mobile").not().isEmpty(), //owner
    // body("owner_id", "owner_id is required").not().isEmpty(),
    body("businessOpenTime", "business Open Time is required").not().isEmpty(),
    body("businessCloseTime", "business Close Time is required")
      .not()
      .isEmpty(),
    body("holidays", "holidays are required").not().isEmpty(),

    body("businessRegistrationNo", "businessRegistrationNo is required")
      .not()
      .isEmpty(),
  ],
  serviceCenterController.registerServiceCenter
);

// register unregistered service center

router.post("/registerunregisteredservicecenter", auth, [
  body("name", "name is required").not().isEmpty(),
  body("district_id", "district is required").not().isEmpty(),
  body("city_id", "city is required").not().isEmpty(),
  body("contact_no_1", "contact_no_1").not().isEmpty(),
  body("businessRegistrationNo", "businessRegistrationNo is required")
    .not()
    .isEmpty(),
  serviceCenterController.addunregisteredServiceCenter,
]);

//  register filingstation

router.post(
  "/registerfilingstation",
  auth,
  [
    body("name", "name is required").not().isEmpty(),
    body("category", "category is required").not().isEmpty(),
    body("district_id", "district is required").not().isEmpty(),
    body("city_id", "city is required").not().isEmpty(),

    body("contact_no_1", "contact_no_1").not().isEmpty(), //owner
    //owner
    // body("owner_id", "owner_id is required").not().isEmpty(),
  ],
  serviceCenterController.registerFilinstation
);

//router.post('/',serviceCenterController.registerServiceCenter);

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

module.exports = router;
