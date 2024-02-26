const express = require("express");
const router = express.Router();

const uedwaController = require("../../controllers/uedwa");

// @route   GET api/uedwa
// @desc    get url
// @access  Public

router.get("/geturl", uedwaController.sendUrl);

module.exports = router;
