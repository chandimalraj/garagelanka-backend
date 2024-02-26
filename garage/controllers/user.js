const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const ObjectId = require("mongodb").ObjectID;

// bring user model
const User = require("../../models/GarageUser");
// bring pending owner module

const PendingOwner = require("../../models/PendingOwners");
// bring service center model
const ServiceCenter = require("../../models/ServiceCenter");

// register Owner

exports.registerPendingOwners = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, garageName, mobile } = req.body;

  console.log(lastName);
  console.log(lastName);

  console.log(garageName);

  try {
    let owner = await PendingOwner.findOne({ mobile: mobile });
    if (owner) {
      return res.status(400).json({ errors: [{ msg: "Owner alrady exsist" }] });
    }

    newPendingowner = new PendingOwner({
      firstName,
      lastName,
      garageName,
      mobile,
    });

    await newPendingowner.save();
    return res.status(201).json({
      success: true,
      message: "Successfully registered owner",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Owner registration failed. Please try again",
    });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    nic,
    email,
    mobile,
    userRole,
    salaryPerDay,
    password,
  } = req.body;

  let serviceCenterID = req.user.serviceCenter._id;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User alrady exsist" }] });
    }

    // see exsistence of the service center

    let serviceCenter = await ServiceCenter.findOne({
      _id: ObjectId(serviceCenterID),
    });

    if (!serviceCenter) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Service center does not exists" }] });
    }

    user = new User({
      firstName,
      lastName,
      email,
      nic,
      mobile,
      userRole,
      salaryPerDay,
      password,
      serviceCenterID,
    });

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to database
    await user.save();

    // Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        serviceCenter: {
          _id: user.serviceCenterID,
          district_id: serviceCenter.district_id,
          city_id: serviceCenter.city_id,
        },
        userRole: user.userRole,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 36000,
      },
      (error, token) => {
        if (error) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Update user

exports.updateUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { firstName, lastName, nic, email, mobile, userRole } = req.body;

  try {
    if (req.user.mobile) {
      // see if user exixts
      let user = await User.findOne({ mobile: mobile });
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.nic = nic || user.nic;
      user.mobile = mobile || user.mobile;

      // save the user to database
      const result = await user.save();
      return res.status(200).send(result);
    }
    res.send(401).send("Updating access denied");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Register User mobile
exports.registerUserMobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    firstName,
    lastName,
    nic,
    email,
    mobile,
    password,
    userRole,
    serviceCenterID,
  } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ email: email });

    if (user) {
      res.status(400).json({ errors: [{ msg: "User alrady exsist" }] });
    }

    user = new User({
      firstName,
      lastName,
      email,
      nic,
      mobile,
      password,
      userRole,
      serviceCenterID,
    });

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to database
    await user.save();

    // Return jsonwebtoken

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        userRole: user.userRole,
        serviceCenterID: user.serviceCenterID,
      },
    };

    jwt.sign(payload, config.get("jwtSecret"), (error, token) => {
      if (error) throw err;
      res.json({ token });
    });
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
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User alrady exsist" }] });
    }

    employee.serviceCenterID = req.user.serviceCenter._id;

    user = new User(employee);

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to database
    await user.save();

    res.status(200).send("New Employee has been Saved Successfully");
    // Return jsonwebtoken
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
