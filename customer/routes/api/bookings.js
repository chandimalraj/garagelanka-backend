const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
// bring booking controller
const bookingController = require("../../controllers/bokings");

// @route   POST api/makeabooking
// @desc    make a sservice booking
// @access  Private
router.post(
  "/makeabooking",
  auth,
  [
    body("serviceCenterID", "service Center Id is required").not().isEmpty(),
    body("serviceTypeId", "service Type Id is required").not().isEmpty(),
    body("mobile", "user's mobile number is required").not().isEmpty(),
    body("serviceType", "service type is required").not().isEmpty(),
    body("vehicleRegNo", "Vehicle registation number is required")
      .not()
      .isEmpty(),
    body("vehicleID", "Vehicle Id is required").not().isEmpty(),
    body("vehicleModelName", "Vehicle Model name is required").not().isEmpty(),
    body("startDate", "start date is required").not().isEmpty(),
    body("endDate", " end date is required").not().isEmpty(),
  ],
  bookingController.createBooking
);

// @route   POST api/makeabooking
// @desc    make a sservice booking
// @access  Private
router.post(
  "/makeinstanceabooking",
  [
    body("serviceCenterID", "service Center Id is required").not().isEmpty(),
    body("serviceTypeId", "service Type Id is required").not().isEmpty(),
    body("mobile", "user's mobile number is required").not().isEmpty(),
    body("serviceType", "service type is required").not().isEmpty(),
    body("vehicleModelName", "Vehicle Model name is required").not().isEmpty(),
    body("startDate", "start date is required").not().isEmpty(),
    body("endDate", " end date is required").not().isEmpty(),
  ],
  bookingController.createInstanceBooking
);

// get all bookings by sc id and date range
router.get(
  "/bookingsbyServiCecenterIdandDateRange",

  bookingController.getBookingsByServiceCenterIDandDateRange
);

// get alrady booed sloets by scId date range and serviceTypeID

router.get(
  "/alradyrecevedslotesbyServiCecenterIdandDateRangeServiceTypeId",

  bookingController.getBookingsByServiceCenterIDandDateRangeServiceTypeId
);

// get all bookings by user id
router.get("/bookingsbyuserid", auth, bookingController.getBookingsByUserID);

router.delete(
  "/deletebooking",
  auth,
  bookingController.deleteBookingbyBookingId
);

// @route   POST api/bookings/updatebooking
// @desc    Edit Booking
// @access  private

router.post(
  "/updatebooking",
  auth,
  [
    body("booking_id", "Booking Id is required").not().isEmpty(),
    body("mobile", "user's mobile number is required").not().isEmpty(),
    body("serviceType", "service type is required").not().isEmpty(),
  ],
  bookingController.updateBookingbyBookingId
);

module.exports = router;
