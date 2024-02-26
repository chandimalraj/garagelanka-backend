const mongoose = require("mongoose");

const fuelTypeSchema = new mongoose.Schema({
  fuelTypeName: {
    type: String,
  },
  fuelTypeimageURL: {
    type: String,
    default: "https://i.ibb.co/dpQDdNL/Untitled-4.png",
  },
});

module.exports = ServiceType = mongoose.model("fuel_types", fuelTypeSchema);
