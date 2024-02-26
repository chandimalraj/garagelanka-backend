const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const order = require("../../controllers/order");

// get orders by customer

router.get("/customer/:id", auth, order.getOrdersByCustomer);

// get order by id

router.get("/:id", auth, order.getOrdersById);

// place an order

router.post(
  "/",
  auth,
  [
    body("total", "total is required").not().isEmpty(),
    body("customer", "customer is required")
      .isObject({ strict: true })
      .not()
      .isEmpty(),
    body("subOrders", "There must be atleaset one order")
      .isArray({ strict: true })
      .not()
      .isEmpty(),
  ],
  order.placeOrder
);

// delete orsser by order ID

router.delete("/delete", auth, order.deleteOrderByOrderId);

module.exports = router;
