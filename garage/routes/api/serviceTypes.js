const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// const ServiceType = require("../../../models/ServiceType");
const serviceTypeController = require("../../controllers/serviceType");

// @route   POST api/serviceTypes
// @desc    get all service types
// @access  Public

router.get("/", serviceTypeController.loadAllSearviceTypes);

// @route POST api/serviceTypes
// @desc Add service types
// @access public
router.post("/", serviceTypeController.registerServiceType);

module.exports = router;
