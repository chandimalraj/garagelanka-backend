const mongoose = require("mongoose");

//Event Schema
const MarketAddreportsScema = new mongoose.Schema({
  merketPlaceAddID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "marketplace-adds",
  },

  Description: {
    type: String,
    required: true,
  },

  Date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Booking = mongoose.model(
  "marketaddreports",
  MarketAddreportsScema
);
