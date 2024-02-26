const mongoose = require("mongoose");

const MakeSchema = new mongoose.Schema({
  make_id: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
});

module.exports = Make = mongoose.model("make", MakeSchema);
