const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const message = require("../../controllers/message");

router.post(
  "/",
  [
    body("name", "name is required").not().isEmpty(),
    body("email", "email is required").isEmail().not().isEmpty(),
    body("message", "message is required").not().isEmpty(),
  ],
  message.addMessage
);

module.exports = router;
