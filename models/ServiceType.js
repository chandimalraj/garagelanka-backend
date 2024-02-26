const mongoose = require("mongoose");

const ServiceTypeSchema = new mongoose.Schema({
  serviceTypeName: {
    type: String,
  },
});

module.exports = ServiceType = mongoose.model(
  "vehicle_service_types",
  ServiceTypeSchema
);
