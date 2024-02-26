const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "notification",
  },

  userName: {
    type: String,
  },
  body: {
    type: String,
  },

  color: {
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
});

module.exports = District = mongoose.model("comment", CommentsSchema);
