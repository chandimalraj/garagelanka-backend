// const config = require("config");
// var ObjectId = require("mongodb").ObjectID;
// const { validationResult } = require("express-validator");
// // bring user,vehicle models

// const SvrRec = require("../../models/svrRec");
// // register vehicle meke model
// exports.savesvrrec = async (req, res) => {
//   const errors = validationResult(req);

//   try {
//     const reqBody = req.body;

//     console.log(reqBody);

//     await reqBody.forEach(function (makecom) {
//       const makeid = makecom.make_id;
//       const name_en = makecom.name_en;

//       // Build make Object
//       const makeFields = {};
//       makeFields.make_id = makeid;
//       makeFields.name_en = name_en;

//       //Add new make
//       make = new Make(makeFields);

//       make.save();
//     });

//     // reqBody.map(({ make_id }) => console.log(make_id));

//     console.log("successfully");

//     res.status(200).send("Successfully saved vehicle make model");
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };
