const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const smsController = require("../../controllers/bulkSms");

router.post(
  "/smsRequest",
  auth,
  [body("SmsText", "Sms Text  is required").not().isEmpty()],
  [body("numbers", "numbers are required").not().isEmpty()],

  smsController.requestSms
);

module.exports = router;

router.get("/getpendingsmsrequests", auth, smsController.getAllpendingsms);
