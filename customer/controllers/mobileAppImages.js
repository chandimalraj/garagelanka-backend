var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const Images = require("../../models/monileAppAPIimages");

// load all homa page cover images
// exports.loadAllImages = async (req, res) => {
//   console.log("Loading all service types...");
//   try {
//     await Images.find({ section: "cover" }, function (err, result) {
//       if (err) return next(err);
//       res.status(200).json(result);
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };

// load all common images of selected section
exports.loadAllCommonImages = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const section = req.query.section;
    console.log(`loading all ${section} images`);

    try {
      const images = await Images.find({ section: section });

      res.status(200).send({ Images: images });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};
