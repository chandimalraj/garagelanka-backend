const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  serviceRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceRecord",
  },
  vehicleId: {
    type: String,
    required: true,
    unique: true,
  },
  province: {
    type: String,
    required: true,
  },
  make: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "make",
  },
  make_name: {
    type: String,
    required: true,
  },

  model: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "model",
  },

  model_name: {
    type: String,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },
  img_url: {
    type: String,
    default:
      "https://i.ibb.co/zPHZQ9D/181-1813878-vector-car-png-file-vector-png-of-car.png",
  },
  fuel_type: {
    type: String,
    default: "Not Entered",
    required: true,
  },
  odometer: {
    type: Number,
    required: true,
  },
  lastServiceDate: {
    type: Date,
  },
  allow: [
    {
      serviceCenterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "garageuser",
      },

      serviceCenterName: {
        type: String,
      },
    },
  ],

  previousUsers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      transferedDate: {
        type: Date,
        default: Date.mow,
      },
    },
  ],
});

module.exports = Vehicle = mongoose.model("vehicle", VehicleSchema);
