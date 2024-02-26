
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const District = require("../../models/District");

/*
Load district Info by district Id
*/
exports.getDistrictById = async function (req, res, next) {
    try {
      const district_id = req.query.district_id;
   
      const district = await District.findById({
        _id: ObjectId(district_id),
      });
  
      if (!district) {
        return res
          .status(400)
          .json({ msg: "There is no district for given district id" });
      }
  
      res.json(district);
    } catch (error) {
      console.error(error.message);
      res.send("Server error");
    }
  };

 


  