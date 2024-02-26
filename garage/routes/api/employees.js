const path = require("path");
const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const employeeController = require("../../controllers/employees");

// router.post(
//   "/addcustomer",
//   auth,
//   [body("coustomerMobile", "customer Mobile is required").not().isEmpty()],
//   customerController.addCustomer
// );

router.get("/getemployees", auth, employeeController.getAllEmployees);

router.get("/getemployeesbyname", auth, employeeController.getEmployeesByName);
// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/registeremployee", auth, [
  body("firstName", "First Name is required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("gender", "gender is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 10,
  }),
  body("salaryType", "salaryType is required").not().isEmpty(),
  body("salary", "salary is required").not().isEmpty(),
  body("addressLineOne", "addressLineOne is required").not().isEmpty(),

  body("userRole", "user Role required").not().isEmpty(),
  body(
    "password",
    "Please Enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  employeeController.registerEmployee,
]);

router.delete(
  "/deleteemployee",
  auth,
  employeeController.deleteEmployeebyEmployeeId
);

module.exports = router;
