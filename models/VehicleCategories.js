const mongoose = require("mongoose");

const VehicleCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = VehicleCategory = mongoose.model(
  "vehicle_category",
  VehicleCategorySchema
);
