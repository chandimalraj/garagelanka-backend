const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
// bring booking controller
const bookingController = require("../../controllers/booking");

// @route   POST api/makeabooking
// @desc    make a sservice booking
// @access  Private
router.post(
  "/makeabooking",
  auth,
  [
    body("serviceTypeId", "service Type Id is required").not().isEmpty(),
    body("coustomerFirstName", "user's first name is required").not().isEmpty(),
    body("mobile", "user's mobile number is required").not().isEmpty(),
    body("serviceType", "service type is required").not().isEmpty(),
    body("vehicleRegNo", "Vehicle registation number is required")
      .not()
      .isEmpty(),
    // body("vehicleModelName", "Vehicle Model name is required").not().isEmpty(),
    body("startDate", "start date is required").not().isEmpty(),
    body("endDate", " end date is required").not().isEmpty(),
  ],
  bookingController.createBooking
);

// get vehicle details by register num

// @route   GET /api/bookings/loadvehiclebyregnum?VehicleId=CAR
// @desc    get all service centers by name and part of name
// @access  Public
router.get("/loadvehiclebyregnum", bookingController.loadVehiclesbyVehicleId);

// get all bookings by s id and date range

router.get(
  "/bookingsbyServiCecenterIdandDateRange",
  auth,
  bookingController.getBookingsByServiceCenterIDandDateRange
);

// Delete bookings
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
