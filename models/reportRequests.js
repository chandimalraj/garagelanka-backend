const mongoose = require("mongoose");

const ReportRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },

  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "confirming",
  },
});

module.exports = Vehicle = mongoose.model("reportrequest", ReportRequestSchema);
