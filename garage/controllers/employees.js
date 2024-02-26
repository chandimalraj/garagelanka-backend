// bring supplier models
const { validationResult } = require("express-validator");
const Employee = require("../../models/GarageUser");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectID;

// exports.addCustomer = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const CustomerData = req.body;
//     CustomerData.serviceCenterId = req.user.serviceCenter._id;

//     const customer = await Customer.findOne({
//       coustomerMobile: CustomerData.coustomerMobile,
//     });

//     if (customer) {
//       return res.status(400).send("Customer Already Exists");
//     } else {
//       const newCustomer = new Customer(CustomerData);
//       await newCustomer.save();
//       return res.status(200).send("Customer has been saved successfully");
//     }

//     // return;
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).send("Server error");
//   }
// };

// get all customers of a service center

exports.getAllEmployees = async (req, res) => {
  console.log("Loading all Employees...");
  try {
    if (req.user.userRole == "Owner") {
      const employees = await Employee.find({
        serviceCenterID: req.user.serviceCenter._id,
      });
      res.status(200).json(employees);
    } else if (req.user.userRole == "receptionist") {
      const employees = await Employee.find({
        serviceCenterID: req.user.serviceCenter._id,
        userRole: { $ne: "Owner" },
      });
      res.status(200).json(employees);
    } else {
      res.status(400).send("You are not allowed to view other employees data");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// register Employee

exports.registerEmployee = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const employee = ({
    firstName,
    lastName,
    gender,
    salaryType,
    salary,
    nic,
    email,
    mobile,
    addressLineOne,
    addressLineTwo,
    emergencyContactNum1,
    emergencyContactNum2,
    bankAccount,
    userRole,
    password,
  } = req.body);

  try {
    // see if employeee exixts
    let employeee = await Employee.findOne({ mobile: mobile, nic: nic });

    if (employeee) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Employeee alrady exsist" }] });
    }

    employee.serviceCenterID = req.user.serviceCenter._id;

    employeee = new Employee(employee);

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    employeee.password = await bcrypt.hash(password, salt);

    // save the employeee to database
    await employeee.save();

    res.status(200).send("New Employee has been Saved Successfully");
    // Return jsonwebtoken
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get employees by name  service center

exports.getEmployeesByName = async (req, res) => {
  console.log("Loading employes by name");
  try {
    const firstName = req.query.firstName;
    console.log(firstName);
    if (req.user.userRole == "Owner") {
      const employees = await Employee.find({
        serviceCenterID: req.user.serviceCenter._id,
        firstName: { $regex: "^" + firstName, $options: "i" },
      });
      res.status(200).json(employees);
    } else if (req.user.userRole == "receptionist") {
      const employees = await Employee.find({
        serviceCenterID: req.user.serviceCenter._id,
        firstName: { $regex: "^" + firstName, $options: "i" },
        userRole: { $ne: "Owner" },
      });
      res.status(200).json(employees);
    } else {
      res.status(400).send("You are not allowed to view other employees data");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.deleteEmployeebyEmployeeId = async function (req, res, next) {
  try {
    const id = req.query.id;

    if (req.user.userRole == "Owner") {
      const deleteResult = await Employee.deleteOne({
        serviceCenterID: req.user.serviceCenter._id,
        _id: ObjectId(id),
      });
      console.log(`${deleteResult.deletedCount} document(s) was/were deleted.`);
      res
        .status(200)
        .send(`${deleteResult.deletedCount} document(s) was/were deleted.`);
    } else {
      res.status(400).send("You are not allowed to view other employees data");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
