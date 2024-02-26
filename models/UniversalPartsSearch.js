const mongoose = require("mongoose");

//OTP system

const universalPartsSearchSchema = new mongoose.Schema({
  itemId: {
    type: String,
  },
  itemName: {
    type: String,
  },

  partCollectionName: {
    type: String,
  },
  partMongoIdinCollection: {
    type: mongoose.Schema.Types.ObjectId,
  },
  barcodeNumber: {
    type: String,
    required: false,
  },

  onlineSellingQuntity: {
    type: Number,
    default: 0,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = OTP = mongoose.model(
  "universalpartssearch",
  universalPartsSearchSchema
);
