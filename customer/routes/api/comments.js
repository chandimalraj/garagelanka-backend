const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const comment = require("../../controllers/comments");

// @route   POST api/pushnotification/sendnotificationtotopic
// @desc    send push notification to topic
// @access  private
router.post(
  "/addcomment",
  auth,

  comment.addComment
);

// @route   GET /api/notification/news.
// @desc    get lesast new
// @access  Public
router.get("/loadallcomments", comment.loadCommentsbyNews);

// @route   GET /api/notification/news.
// @desc    get lesast new
// @access  Public
router.get("/loadallnewsandcomments", comment.loadNewsAndComments);
module.exports = router;
