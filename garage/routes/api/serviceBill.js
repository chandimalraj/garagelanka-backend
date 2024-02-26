const path = require("path");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const auth = require("../../middleware/auth");
const serviceBillController = require("../../controllers/serviceBill");

router.post("/", auth, serviceBillController.addServiceBill);

//router.get("/", instantBillController.loadinstantBills);
//router.get("/loadinstantBillsbyRef", instantBillController.loadinstantBillbyRef);

// @route POST api/serviceTypes
// @desc Add service types
// @access public

// router.post(
//     "/",
//     auth,
//     instantBillController.addInstantBill);

router.post("/", auth, serviceBillController.addServiceBill);

router.get("/", auth, serviceBillController.getServiceBillsByServiceCenter);

router.get("/date", auth, serviceBillController.getServiceBillsByDate);

router.get("/vehicle/:vehicleId", auth, serviceBillController.getVehicleData);

router.get("/:id", auth, serviceBillController.getServiceBillsById);

// @route   GET api/users
// @desc    get vehicles of customer by mobile number
// @access  Private
router.get("/get-vehicles", auth, [
  body("mobile", "mobile number is required").not().isEmpty(),
  serviceBillController.getVehiclesByMobileNumber
])

module.exports = router;
