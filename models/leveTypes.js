const mongoose = require("mongoose");

const LeveTypeSchema = new mongoose.Schema({
  leaveTypeName: {
    type: String,
  },
  duration: {
    type: Number,
  },
});

module.exports = ServiceType = mongoose.model("leve_types", LeveTypeSchema);
