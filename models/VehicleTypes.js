const mongoose = require("mongoose");

const VehicleTypeSchema = new mongoose.Schema({
  vehicleTypeName: {
    type: String,
  },
});

module.exports = ServiceType = mongoose.model(
  "vehicletypes",
  VehicleTypeSchema
);
