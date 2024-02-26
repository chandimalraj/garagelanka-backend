const mongoose = require("mongoose");

const GarageUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
  fireBaseId: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },

  serviceCenterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
    required: true,
  },

  userRole: {
    type: String,
    required: true,
  },
  salaryPerDay: {
    type: Number,
    required: true,
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
  leaves: [
    {
      leaveTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "leve_types",
      },
      leveTypeName: {
        type: String,
      },
      RequestedDate: {
        type: Date,
      },
      LeaveDate: {
        type: Date,
      },
      Status: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("garageuser", GarageUserSchema);
