const mongoose = require("mongoose");

const UserRoleSchema = new mongoose.Schema({
  userRoleName: {
    type: String,
  },
});

module.exports = ServiceType = mongoose.model("user-roles", UserRoleSchema);
