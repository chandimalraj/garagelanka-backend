const mongoose = require("mongoose");

const UseerTrafficofAppSchema = new mongoose.Schema({
  part: {
    type: String,
    default: "",
  },
  traffic: {
    type: Number,
    default: 0,
  },
});

module.exports = District = mongoose.model(
  "usertraffic",
  UseerTrafficofAppSchema
);
