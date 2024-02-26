const mongoose = require("mongoose");

const MarketplaceVehicleSchema = {
  make: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "make",
    required: true,
  },
  makeName: {
    type: String,
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "model",
    required: true,
  },
  modelName: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle_category",
  },
  year: {
    type: Number,
  },
  engineCapacity: {
    type: String,
  },
  fuelType: {
    type: String,
  },
  transmission: {
    type: String,
  },
  gears: {
    type: Number,
  },
  odometer: {
    type: Number,
  },
  airbags: {
    type: Number,
  },
  color: {
    type: String,
  },
  ownership: {
    type: Number,
  },
  openPapper: {
    type: Boolean,
    default: false,
  },
  features: {
    airCondition: {
      type: Boolean,
      default: false
    },
    powerSteering: {
      type: Boolean,
      default: false
    },
    powerWindow: {
      type: Boolean,
      default: false
    },
    powerMirror : {
      type: Boolean,
      default: false
    }
  }
};

module.exports = MarketplaceVehicleSchema;
