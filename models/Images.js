const mongoose = require("mongoose");

const ImagesSchema = new mongoose.Schema({
  section: { type: String },
  imageName: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  details: {
    category: { type: String, require: true },
    itemName: { type: String, require: true },
    price: { type: String, require: true },
    cutedPrice: { type: String, require: true },
  },
});

module.exports = ServiceType = mongoose.model("images", ImagesSchema);
