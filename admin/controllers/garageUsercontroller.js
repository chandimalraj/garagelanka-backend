const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const ObjectId = require("mongodb").ObjectID;

// bring user model
const User = require("../../models/GarageUser");
// bring service center model
const ServiceCenter = require("../../models/ServiceCenter");

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
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
    serviceCenterID,
  } = req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ $or: [{ mobile: mobile }, { nic: nic }] });

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
      serviceCenterID,
    });

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to database
    await user.save();

    // serviceCenter.ownerId = user._id;

    // await serviceCenter.save();

    res.status(200).send("Garage user saved successfully and service center");
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

  let { firstName, lastName, nic, email, mobile, userRole, serviceCenterID } =
    req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ nic: nic });
    if (!user) {
      return res.status(401).send("There is no user ");
    } else {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.nic = nic || user.nic;
      user.mobile = mobile || user.mobile;
      user.serviceCenterID = serviceCenterID || user.serviceCenterID;
      user.userRole = userRole || user.userRole;

      // save the user to database
      const result = await user.save();
      return res.status(200).send(result);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Register Garage owner

exports.registerOwner = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, nic, email, mobile, password, serviceCenterID } =
    req.body;

  const userRole = "Owner";

  try {
    // see if user exixts
    let user = await User.findOne({ $or: [{ mobile: mobile }, { nic: nic }] });

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

    const ownServiceCenters = {
      serviceCenterID: serviceCenter._id,
      serviceCenterName: serviceCenter.name,
      logoUrl: serviceCenter.logoUrl,
      imgUrl: serviceCenter.imgUrl,
    };

    user = new User({
      firstName,
      lastName,
      nic,
      email,
      mobile,
      userRole,
      password,
      ownServiceCenters,
    });

    // Encrypth the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // save the user to database
    await user.save();

    // serviceCenter.ownerId = user._id;

    // await serviceCenter.save();

    res.status(200).send("Garage owner saved successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// find garage user (find one (mobile number))

// update owner (user id)

// add service centers to garage owners (user id)

// remove service center from garage owners (user id)

// token eken check karanna meyage user role eka ownerda kiyala check user.userRole == "Owner"
