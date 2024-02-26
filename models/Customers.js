const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  serviceCenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service_center",
  },
  coustomerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  coustomerMobile: {
    type: String,
    required: true,
  },
  vehicles: [
    {
      make: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "make",
      },
      make_name: {
        type: String,
      },

      model: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "model",
      },
      model_name: {
        type: String,
      },
      registationNumber: {
        type: String,
      },
    },
  ],
});

module.exports = Supplier = mongoose.model("customer", CustomerSchema);
