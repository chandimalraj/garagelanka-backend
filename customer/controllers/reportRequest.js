const config = require("config");

var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const ReportRequest = require("../../models/reportRequests");

// add report Request with vehicle Id
exports.createReportRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { vehicleID, startDate, endDate, description } = req.body;

    const { id } = req.user;

    // Build reportRequest Object
    const reportRequestFields = {};

    reportRequestFields.user = id;
    reportRequestFields.vehicle = vehicleID;
    reportRequestFields.startDate = new Date(startDate).toISOString();
    reportRequestFields.endDate = new Date(endDate).toISOString();
    reportRequestFields.description = description;

    reportRequest = new ReportRequest(reportRequestFields);

    await reportRequest.save();

    res.status(200).json({
      msg: `report request has been saved successfully`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getreportRequestsByUserIDandVehicleId = async function (
  req,
  res,
  next
) {
  console.log(req.user.id);
  try {
    const requests = await ReportRequest.find({
      user: req.user.id,
      vehicle: req.query.vehicleID,
    });

    if (!requests) {
      return res.status(400).json({ msg: "There is no report requests" });
    }

    res.status(200).json({ reportRequests: requests });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.deleteRequestsByUserIDandVehicleId = async function (req, res, next) {
  try {
    const reportRequest_id = req.query.reportRequest_id;

    const request = await ReportRequest.findById({
      _id: ObjectId(reportRequest_id),
    });

    if (!request) {
      return res.status(400).json({ msg: "There is no reportRequest" });
    } else {
      // check user and condition demorgan's law
      if (request.user.toString() !== req.user.id) {
        return res
          .status(400)
          .json({ msg: "User not authorized to delete this request" });
      } else if (request.status !== "confirming") {
        return res.status(400).json({
          msg: `you can not delete the request since it's in the ${request.status} stage`,
        });
      } else {
        const deleteResult = await ReportRequest.deleteOne({
          _id: ObjectId(reportRequest_id),
        });

        res.status(200).send("Report Request Deleted");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
