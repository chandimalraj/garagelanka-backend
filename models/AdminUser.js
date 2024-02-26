const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
    unique: true,
  },
  userRole: {
    type: String,
    required: true,
    default: "employee",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  resetString: {
    type: String,
    default: null,
  },
  resetStringTime: {
    type: Date,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("adminuser", AdminUserSchema);
