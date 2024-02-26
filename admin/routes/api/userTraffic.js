const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
// const multer = require("multer");
const auth = require("../../middleware/auth");
// bring image controller

const userTrafficController = require("../../controllers/userTraffic");

// //multer config
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
//     cb(null, true);
//   else cb(null, false); //reject file
// };

// const upload = multer({
//   storage: multer.memoryStorage(), //storage,
//   limits: { fileSize: 1024 * 1024 * 2 }, //file size 2MB
//   fileFilter: fileFilter,
// });

// @route POST api/images/registerimage
// @desc Add new images
// @access Private
router.post(
  "/registerusertraffic",
  auth,
  [body("part", "user traffic part is required").not().isEmpty()],
  userTrafficController.registerUserTrafficPart
);

// // @route POST api/images/updateimage
// // @desc update exsisting images
// // @access Private
// router.post(
//   "/updatecommonimages",
//   auth,
//   [
//     body("imageName", "image Name is required").not().isEmpty(),
//     body("section", "section is required").not().isEmpty(),
//     body("newImageURL", "newimageURL is required").not().isEmpty(),
//   ],
//   userTrafficController.uppdateCommonImages
// );

// // @route   GET api/images/
// // @desc    get Images
// // @access  Public
// router.get(
//   "/allcommonimageswithsection",
//   [body("section", "section is required").not().isEmpty()],
//   userTrafficController.loadAllCommonImages
// );

module.exports = router;
