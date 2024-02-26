const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../../middleware/auth");
const orders = require("../../controllers/orders");

// get suborder by id

router.get("/suborder/:id", auth, orders.getOrdersById);

// get suborders for service center
router.get("/", auth, orders.getOrdersByServiceCenter);

// update suborder
router.patch(
  "/updateorder",
  auth,
  [
    body("sellerStatus", "sellerStatus is required").not().isEmpty(),
    body("orderTotal", "orderTotal is required").not().isEmpty(),
    body("deliveryCost", "deliveryCost is required").not().isEmpty(),
    body("subTotal", "subTotal is required").not().isEmpty(),
  ],
  orders.updateSuborder
);

// update suborder status
router.get("/:id", auth, orders.updateSuborderStatus);

module.exports = router;
