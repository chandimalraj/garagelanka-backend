const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const inventoryController = require("../../controllers/inventory");

router.post(
  "/",
  auth,
  [
    body("item_name", "item name  is required").not().isEmpty(),
    body("item_barcode", "item barcode is required").not().isEmpty(),
    body("quantity", "quantity is required").not().isEmpty(),
    body("selling_price", "selling price is required").not().isEmpty(),
    body("buying_price", "buying price is required").not().isEmpty(),
    body("online_status", "online status is required").not().isEmpty(),
  ],
  inventoryController.addInventory
);

router.get("/check-barcode", auth, inventoryController.checkBarcode);

module.exports = router;
