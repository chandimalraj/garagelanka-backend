const mongoose = require("mongoose");

const SmsRequestSchema = new mongoose.Schema({
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
  },
  status: {
    type: String,
    required: true,
  },
  SmsText: {
    type: String,
    required: true,
  },
  numbers: [
    {
      type: String,
    },
  ],
});

module.exports = Supplier = mongoose.model("smsrequest", SmsRequestSchema);
