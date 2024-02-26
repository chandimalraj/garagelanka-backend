const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const MarketplaceAddReport = require("../../models/MarketplaceAddReports");

exports.createAddReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let report = ({ merketPlaceAddIDDescription } = req.body);

    report = new MarketplaceAddReport(report);
    await report.save();
    res.status(200).json({
      msg: `Your Complain has been recorded Successfully`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getMarketplaceAddreportsDateRange = async function (req, res, next) {
  try {
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    // console.log(
    //   "start time",
    //   new Date(new Date(startDate).setHours(00, 00, 00)).toISOString()
    // );
    // console.log(
    //   "end time",
    //   new Date(new Date(endDate).setHours(00, 00, 00)).toISOString()
    // );

    const complains = await MarketplaceAddReport.find({
      Date: {
        $gte: new Date(new Date(startDate).setHours(00, 00, 00)).toISOString(),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59)).toISOString(),
      },
    });

    if (!complains) {
      return res.status(404).json({
        msg: `There is no complains between ${startDate} & ${endDate}`,
      });
    }

    res.status(200).json({ Complains: complains });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
