const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const supplierController = require("../../controllers/supplier");

router.post(
  "/addsupplier",
  auth,
  [body("supplierName", "supplier Name is required").not().isEmpty()],
  supplierController.addSupplier
);

router.get("/getsuppliers", auth, supplierController.getAllSuppliers);

module.exports = router;
