const mongoose = require("mongoose");

const PendingOwnerSchma = new mongoose.Schema({
  firstName: { type: String },
  lastName: {
    type: String,
  },
  mobile: { type: String, require: true },

  garageName: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Owner = mongoose.model("pendingOwner", PendingOwnerSchma);
