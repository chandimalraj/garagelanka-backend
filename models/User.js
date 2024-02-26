const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },

  fireBaseId: {
    type: String,
  },
  profilePictureLink: {
    type: String,
  },
  userRole: {
    type: String,
    required: true,
    default: "customer",
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
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
    default: "By Customer",
  },
  registerdServiceCentrId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
  },

  registerdServiceCentrUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "garageuser",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "ACTIVATED",
  },
  vehicles: {
    type: Array,
  },
  paymentExpire: {
    type: Date,
  },

  lastFuelStationUpdateTime: {
    type: Date,
  },

  stationUpdateCount: {
    type: Number,
    default: 0,
  },

  subscribedVehicleTipics: [
    {
      topic: { type: String },
      makeName: { type: String },
      modelName: { type: String },
    },
  ],
});

module.exports = User = mongoose.model("user", UserSchema);
