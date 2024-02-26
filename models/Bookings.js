const mongoose = require("mongoose");

//Event Schema
const BookingSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  serviceCenterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
  },

  scUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "garageuser",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  serviceTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle_service_types",
    required: true,
  },
  colorCode: {
    type: String,
  },

  vehicleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },

  bookingType: {
    type: String,
  },

  userFirstName: {
    type: String,
  },
  userLastName: {
    type: String,
  },

  mobile: {
    type: String,
  },

  serviceType: {
    type: String,
  },

  vehicleRegNo: {
    type: String,
  },
  vehicleMakeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "make",
  },
  vehicleModelID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "model",
  },
  vehicleModelName: {
    type: String,
  },
  bookingDate: {
    type: Date,
  },

  startDate: {
    type: Date,
  },

  endDate: {
    type: Date,
  },

  description: {
    type: String,
  },
});

module.exports = Booking = mongoose.model("booking", BookingSchema);
