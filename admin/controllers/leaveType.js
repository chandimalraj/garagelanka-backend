const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const LeaveType = require("../../models/leveTypes");

exports.loadAllLeaveTypes = async (req, res) => {
  console.log("Loading all leave types...");
  try {
    await LeaveType.find(function (err, result) {
      console.log("All leave types", result);
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerLeaveType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { leaveTypeName, duration } = req.body;
    console.log("Leave Type saving : " + leaveTypeName);

    let leaveType = await LeaveType.findOne({
      leaveTypeName: req.body.leaveTypeName,
    });

    if (leaveType) {
      console.log("leave Type already registered : " + leaveTypeName);
      res.status(400).json({
        errors: [{ msg: ` ${leaveTypeName} leave Type alrady registered` }],
      });
    } else {
      //Add new service center
      console.log("Add new leave Type  : " + leaveTypeName);
      leaveType = new LeaveType({
        leaveTypeName,
        duration,
      });

      await leaveType.save();

      res.json({ status: "Successfully saved leave type" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
