const mongoose = require("mongoose");

const VehiclemarketTopicsSchema = new mongoose.Schema({
  topic: {
    type: String,
  },

  make: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "make",
  },
  makeName: {
    type: String,
    required: true,
  },

  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "model",
  },

  modelName: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now() },
});

module.exports = City = mongoose.model(
  "vehicletopics",
  VehiclemarketTopicsSchema
);
