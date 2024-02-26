const mongoose = require("mongoose");

const VehicleConditionSchema = new mongoose.Schema({
  vehicleCondition: {
    type: String,
  },
});

module.exports = VehicleCondition = mongoose.model(
  "vehiclecondition",
  VehicleConditionSchema
);
// vehicle
