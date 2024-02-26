const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  topic: {
    type: String,
  },
  category: {
    type: String,
  },
  day: {
    type: String,
  },
  time: {
    type: String,
  },
  timeDifference: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },

  numberofComments: {
    type: Number,
    default: 0,
  },

  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = District = mongoose.model("notification", NotificationSchema);
