const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const City = require("../../models/City");

exports.loadAllCitiesbyDistrictID = async function (req, res, next) {
  try {
    console.log("Loading district with id:" + req.query.district_id);
    const district_id = req.query.district_id;
    await City.find({ district_id: district_id }, function (err, result) {
      if (err) return next(err);
      res.json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
