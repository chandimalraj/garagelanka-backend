const mongoose = require("mongoose");

const MobileAppImagesSchema = new mongoose.Schema({
  section: { type: String },
  imageName: {
    type: String,
    unique: true,
  },
  imageURL: {
    type: String,
  },
  description: {
    type: String,
    default: "",
  },

  link: {
    type: String,
    default: "",
  },
});

module.exports = ServiceType = mongoose.model(
  "mobileimages",
  MobileAppImagesSchema
);
