var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const UserTraffic = require("../../models/UserTrafficofApp");

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

// Register Common images

exports.registerUserTrafficPart = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { part } = req.body;

    let traficSection = await UserTraffic.findOne({
      part: part,
    });

    if (traficSection) {
      res
        .status(400)
        .json({ errors: [{ msg: "Traffic Section alrady registered" }] });
    } else {
      //Add new image

      trafficObj = new UserTraffic({
        part,
      });

      await trafficObj.save();

      res
        .status(200)
        .json({ msg: "Traffic Section has been registerd successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

// //  Update  common images
// exports.uppdateCommonImages = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const { imageName, newImageURL, section, description, link } = req.body;

//     let image = await Images.findOne({
//       section: section,
//       imageName: imageName,
//     });

//     if (!image) {
//       res
//         .status(400)
//         .json({ errors: [{ msg: "Image Name is not registerd registered" }] });
//     } else {
//       if (newImageURL) {
//         image.imageURL = newImageURL;
//       }
//       if (section) {
//         image.section = section;
//       }
//       if (description) {
//         image.description = description;
//       }
//       if (link) {
//         image.link = link;
//       }

//       await image.save();

//       res.status(200).json({ msg: "image has been updated successfully" });
//     }
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send(error.message);
//   }
// };

// // load all common images of selected section
// exports.loadAllCommonImages = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   } else {
//     const section = req.query.section;
//     console.log(`loading all ${section} images`);

//     try {
//       const images = await Images.find({ section: section });

//       res.status(200).send({ Images: images });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Server error");
//     }
//   }
// };
