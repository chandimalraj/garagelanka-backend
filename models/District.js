const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  province_id: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
});

module.exports = District = mongoose.model("district", DistrictSchema);
