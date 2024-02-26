const mongoose = require("mongoose");

//Event Schema
const PaymentScema = new mongoose.Schema({
  id: {
    type: Number,
  },
  paymentAmmountLKR: {
    type: Number,
    required: true,
  },

  paymentMethod: {
    type: String,
    required: true,
  },

  payedby: {
    type: String,
    required: true,
  },

  paymentDateAndTime: {
    type: Date,
    default: Date.now,
  },

  Bank: {
    type: String,
  },

  branch: {
    type: String,
  },

  slipId: {
    type: String,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  serviceCenterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
  },

  scUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  description: {
    type: String,
  },
});

module.exports = Booking = mongoose.model("payments", PaymentScema);
