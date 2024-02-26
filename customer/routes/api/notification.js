const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const notificationController = require("../../controllers/pushNotification");

// filing stations

// @route   GET /api/notification/news.
// @desc    get lesast new
// @access  Public
router.get("/loadlastnews", notificationController.loadLastNews);

module.exports = router;
