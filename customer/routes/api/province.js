const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const provinceController = require("../../controllers/province");

// @route   GET api/province/
// @desc    get province
// @access  Public
router.get("/getallprovince", provinceController.loadAllProovince);

// @route POST api/province/registerprovince
// @desc Add new province
// @access Private
router.post(
  "/registerprovince",
  auth,
  [body("provinceName", "province Name is required").not().isEmpty()],
  [body("shortName", "short province Name is required").not().isEmpty()],
  provinceController.registerProovince
);

module.exports = router;
