const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const LeaveType = require("../../models/leveTypes");

exports.loadAllLeaveTypes = async (req, res) => {
  console.log("Loading all leave types...");
  try {
    await LeaveType.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
