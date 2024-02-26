const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const auth = require("../../middleware/auth");
// bring image controller

const imageController = require("../../controllers/images");

//multer config
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false); //reject file
};

const upload = multer({
  storage: multer.memoryStorage(), //storage,
  limits: { fileSize: 1024 * 1024 * 2 }, //file size 2MB
  fileFilter: fileFilter,
});

// @route   GET api/images/
// @desc    get Images
// @access  Public
router.get("/allcovers", imageController.loadAllImages);

// @route POST api/images/registerimage
// @desc Add new images
// @access Private
router.post(
  "/registercommonimage",
  auth,
  [
    body("imageName", "image Name is required").not().isEmpty(),
    body("section", "section is required").not().isEmpty(),
    body("imageURL", "imageURL is required").not().isEmpty(),
  ],
  imageController.registerCommonImages
);

// @route POST api/images/updateimage
// @desc update exsisting images
// @access Private
router.post(
  "/updatecommonimages",
  auth,
  [
    body("imageName", "image Name is required").not().isEmpty(),
    body("section", "section is required").not().isEmpty(),
    body("newImageURL", "newimageURL is required").not().isEmpty(),
  ],
  imageController.uppdateCommonImages
);

// @route   GET api/images/
// @desc    get Images
// @access  Public
router.get("/allcommonimageswithsection", imageController.loadAllCommonImages);
// spare parts images

//  @route   GET api/images/
// @desc    get Images
// @access  Public
router.get("/allpartsimages", imageController.loadAllPartsImages);

// @route POST api/images/registerimage
// @desc Add new images
// @access Private
router.post(
  "/registerpartsimage",
  auth,
  [
    body("imageName", "image Name is required").not().isEmpty(),
    body("imageURL", "imageURL is required").not().isEmpty(),
  ],
  imageController.registerPartsImages
);

// @route POST api/images/updateimage
// @desc update exsisting images
// @access Private
router.post(
  "/updatepartsImages",
  auth,
  [
    body("imageName", "image Name is required").not().isEmpty(),
    body("newImageURL", "newimageURL is required").not().isEmpty(),
  ],
  imageController.uppdatePartsImages
);

// Hot deals images

//  @route   GET api/images/
// @desc    get Images
// @access  Public
router.get("/allhotdealsimages", imageController.loadAllHotDealsImages);

// @route POST api/images/registerimage
// @desc Add new images
// @access Private
router.post(
  "/registerhotdealsimage",
  auth,
  [
    body("imageName", "image Name is required").not().isEmpty(),
    body("imageURL", "imageURL is required").not().isEmpty(),
    body("details", "hotdeal details is required").not().isEmpty(),
  ],
  imageController.registerHotDealsImages
);

// @route POST api/images/updateimage
// @desc update exsisting images
// @access Private
router.post(
  "/updatehotdealsImages",
  auth,
  [body("imageName", "image Name is required").not().isEmpty()],
  imageController.uppdateHotDealsImages
);

module.exports = router;
