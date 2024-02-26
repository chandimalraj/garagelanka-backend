const mongoose = require("mongoose");

const VehicleManufacturedYearSchema = new mongoose.Schema({
  year: {
    type: Number,
  },
});

module.exports = VehicleManufacturedYear = mongoose.model(
  "vehiclemanufacturedyear",
  VehicleManufacturedYearSchema
);
// vehicle
