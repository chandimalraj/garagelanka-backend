const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const serviceCenterController = require("../../controllers/serviceCenter");

// register service center
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
    body("longitude", "longitude is required").not().isEmpty(),
    body("latitude", "latitude is required").not().isEmpty(),
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

// @route   POST /api/serviceCenters/registerserviceTypes
// @desc   Register new service types offerd by the service center
// @access  Private
router.post(
  "/registerservicetype",
  auth,
  [
    body("serviceoffers", "serviceoffers should be an array").isArray(),

    body("serviceoffers.*.serviceTypeId", "Service Type Id is required")
      .not()
      .isEmpty(),
    body("serviceoffers.*.serviceTypeName", " serviceTypeName is required")
      .not()
      .isEmpty(),
    body("serviceoffers.*.colorCode", " colorCode is required").not().isEmpty(),
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

// @route   GET /api/serviceCenters.
// @desc    get all service centers
// @access  Private
router.get("/", auth, serviceCenterController.loadAllSearviceCenters);

// @route   GET /api/serviceCenters.
// @desc    get all service centers
// @access  Private
router.get(
  "/geolocation",
  auth,
  serviceCenterController.loadAllSearviceCentersByLocation
);

// @route   GET/api/serviceCenters/getservicetypesbyscid
// @desc   get all service types offerd by the service center
// @access  Private
router.get(
  "/getservicetypesbyscid",
  auth,
  serviceCenterController.getallservicetypesbysc_id
);

// @route   POST /api/serviceCenters/adddiscount
// @desc   Register new service types offerd by the service center
// @access  Private
router.post(
  "/adddiscount",
  auth,
  [
    body("sc_id", "sc_id is required").not().isEmpty(),
    body("discount", "discount should be an array").isArray(),

    body("discount.*.discountName", "discount Name is required")
      .not()
      .isEmpty(),
    body("discount.*.serviceTypeId", " service Type Id is required")
      .not()
      .isEmpty(),
    body("discount.*.discountDisplayText", "Discount Display Text is required")
      .not()
      .isEmpty(),
    body(
      "discount.*.discountStartDate",
      "Discount Start Date is required and should be date"
    )
      .not()
      .isEmpty(),
    body(
      "discount.*.discountEndDate",
      "Discount End Date is required and should be date"
    )
      .not()
      .isEmpty(),
  ],
  serviceCenterController.addrNewDiscount
);

// fuel types

// @route   POST /api/serviceCenters/updatefualtype
// @desc   update fuel types availability
// @access  Private
router.post(
  "/updtatefueltype",
  auth,
  [
    body("fuelTypesProvided", "fuelTypesProvided should be an array").isArray(),

    body("fuelTypesProvided.*.fuelTypeId", "Service Type Id is required")
      .not()
      .isEmpty(),
    body("fuelTypesProvided.*.fuelTypeName", " fuelTypeName is required")
      .not()
      .isEmpty(),
    body("fuelTypesProvided.*.availability", " availability is required")
      .not()
      .isEmpty(),
  ],
  serviceCenterController.updateFuelStatus
);
module.exports = router;
