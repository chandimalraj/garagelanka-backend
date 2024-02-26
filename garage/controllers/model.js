const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const Model = require("../../models/Model");
// register vehicle models
exports.registermodel = async (req, res) => {
  const errors = validationResult(req);

  try {
    const reqBody = req.body;

    console.log(reqBody);

    await reqBody.forEach(function (modelcom) {
      const make_id = modelcom.make_id;
      const model_id = modelcom.model_id;
      const name_en = modelcom.name_en;

      // Build model Object
      const modelFields = {};
      modelFields.make_id = make_id;
      modelFields.model_id = model_id;
      modelFields.name_en = name_en;

      //Add new model
      model = new Model(modelFields);

      model.save();
    });

    console.log("successfully");

    res.status(200).send("Successfully saved vehicle model");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
