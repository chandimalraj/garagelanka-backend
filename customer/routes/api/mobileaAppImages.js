const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
// const multer = require("multer");
const auth = require("../../middleware/auth");
// bring image controller

const imageController = require("../../controllers/mobileAppImages");

// @route   GET api/images/
// @desc    get Images
// @access  Public
router.get("/allcommonimageswithsection", imageController.loadAllCommonImages);

module.exports = router;
