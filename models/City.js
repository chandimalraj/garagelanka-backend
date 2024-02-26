const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  district_id: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
});

module.exports = City = mongoose.model("city", CitySchema);
