const mongoose = require("mongoose");

const ProvinceSchema = new mongoose.Schema({
  provinceName: {
    type: String,
    require: true,
    unique: true,
  },

  shortName: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = City = mongoose.model("provinces", ProvinceSchema);
