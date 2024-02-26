var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const Proovince = require("../../models/Province");

exports.loadAllProovince = async (req, res) => {
  console.log("Loading all Province");
  try {
    await Proovince.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerProovince = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { provinceName, shortName } = req.body;

    let province = await Proovince.findOne({
      provinceName: provinceName,
    });

    if (province) {
      res
        .status(400)
        .json({ errors: [{ msg: "province has been alrady registered" }] });
    } else {
      //Add new image

      provinceObj = new Proovince({
        provinceName: provinceName,
        shortName: shortName,
      });

      await provinceObj.save();

      res.json({ status: "province Has been saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
