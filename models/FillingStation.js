const mongoose = require("mongoose");

const FuelStationSchema = new mongoose.Schema({
  StationName: {
    type: String,
    required: true,
  },
  fireBaseId: {
    type: String,
  },

  address: {
    type: String,
  },

  district_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "district",
  },
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },

  mobile: {
    type: String,
    required: true,
    unique: true,
  },

  location: { type: { type: String }, coordinates: [] },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },

  lastUpdateTime: {
    type: Date,
  },
  nic: {
    type: String,
  },

  fuelTypesProvided: [
    {
      fuelTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fuel_types",
      },
      fuelTypeName: {
        type: String,
      },
      fuelTypeimageURL: {
        type: String,
      },
      availability: {
        type: Boolean,
        default: true,
      },
    },
  ],
  queue: {
    type: String,
    default: "Small",
  },

  password: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
    default: null,
  },
  resetStringTime: {
    type: Date,
  },
  registeredMethod: {
    type: String,
    default: "By Station",
  },

  status: {
    type: String,
    default: "pending",
  },
  open: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("fuelstation", FuelStationSchema);
