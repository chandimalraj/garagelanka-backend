const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const customerController = require("../../controllers/customer");

router.post(
  "/addcustomer",
  auth,
  [body("coustomerMobile", "customer Mobile is required").not().isEmpty()],
  customerController.addCustomer
);

router.get("/getcustomers", auth, customerController.getAllCustomers);

router.get(
  "/getcustomerswithname",
  auth,
  customerController.getCustomersWithName
);

router.get(
  "/getcustomerswithfilter",
  auth,
  customerController.getAllCustomersOfaServiceCenterWithFilters
);

router.post("/updatecustomer", auth, customerController.updateCustomer);

// Delete customer
router.delete("/deletecustomer", auth, customerController.deletecustomer);

module.exports = router;
