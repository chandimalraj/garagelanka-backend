const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const config = require("config");
const axios = require("axios");
var ObjectId = require("mongodb").ObjectID;

const customerUtill = require("./utils/customer");

const User = require("../../models/User");
const Vehicle = require("../../models/Vehicle");
const Customer = require("../../models/Customers");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

// Register customer User
exports.registerCustomerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, nic, email, mobile } = req.body;
  const { id, serviceCenter } = req.user;

  try {
    // register customer to service ceneter

    const CustomerData = { firstName, lastName, mobile, email };
    const serviceCenterId = req.user.serviceCenter._id;

    const addCustomertoServiceCenter =
      await customerUtill.addCustomertoServiceCenter(
        CustomerData,
        serviceCenterId
      );

    console.log("add cusromer to service center", addCustomertoServiceCenter);
  } catch (error) {
    console.error(error.message);
  } finally {
    try {
      // see if user exixts
      let user = await User.findOne({
        $or: [{ mobile: mobile }, { nic: nic }],
      });

      if (user) {
        res.status(400).json({
          errors: [
            { msg: "User alrady exsist mobile or NIC alrady registerd" },
          ],
        });
      }

      password = nic;
      registeredMethod = "By Service Center";
      registerdServiceCentrId = serviceCenter._id;
      registerdServiceCentrUserId = id;

      user = new User({
        firstName,
        lastName,
        email,
        nic,
        registeredMethod,
        registerdServiceCentrId,
        registerdServiceCentrUserId,
        mobile,
        password,
      });

      // Encrypth the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // save the user to database
      await user.save();

      console.user;

      // Send SMS To Customer

      var smsmobile = mobile.substring(1);
      smsmobile = "94".concat(smsmobile);
      (message = `Dear ${firstName} your Garae Lanka coount has been successfully created. Your default password is your NIC ${nic}}`),
        console.log("Message length", message.length);
      // send msg notify to user
      const msg = await axios.post("https://app.notify.lk/api/v1/send", {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: smsmobile,
        message: `Dear ${firstName} your Garae Lanka account has been successfully created. Your default password is your NIC ${nic}}`,
      });

      res.status(200).send("You have registed a customer successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// register customer vehicle

// register vehicle
exports.registerVehicle = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    let vehicle = await Vehicle.findOne({
      vehicleId: req.body.vehicleId,
    }).populate("user");

    if (vehicle) {
      res.status(400).json({
        msg: `Vehicle alrady registered `,
        currentUser: ` ${vehicle.user.firstName} ${vehicle.user.lastName}`,
        currentUserContact: vehicle.user.mobile,
      });
    } else {
      //  find user

      let user = await User.findOne({
        $or: [{ mobile: req.body.mobile }, { nic: req.body.nic }],
      });

      if (!user) {
        res.status(400).json({
          errors: [{ msg: "There is no user registed" }],
        });
      }

      let img_url = "https://i.ibb.co/PwHHVwC/benzc200amg.png"; //default image

      const {
        vehicleId,
        province,
        make,
        make_name,
        model,
        model_name,
        fuel_type,
        year,
        odometer,
      } = req.body;

      // Build Vehicle Object
      const vehicleFields = {};
      vehicleFields.user = user._id;
      vehicleFields.vehicleId = vehicleId;
      vehicleFields.province = province;
      vehicleFields.make = make;
      vehicleFields.make_name = make_name;
      vehicleFields.model = model;
      vehicleFields.model_name = model_name;
      vehicleFields.fuel_type = fuel_type;
      vehicleFields.year = year;
      vehicleFields.img_url = img_url;
      vehicleFields.odometer = odometer;

      //Add new vehicle
      vehicle = new Vehicle(vehicleFields);

      await vehicle.save();

      //Update user : Add vehicle id to vehicle array

      //Update user : Add vehicle id to vehicle array
      User.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { vehicles: vehicleId } },

        function (err, res) {
          if (err) throw err;
          console.log("User successfully updated");
        }
      );

      // add user to the service center

      serviceCenterVehicle = {};
      serviceCenterVehicle.make = make;
      serviceCenterVehicle.make_name = make_name;
      serviceCenterVehicle.model = model;
      serviceCenterVehicle.model_name = model_name;
      serviceCenterVehicle.registationNumber = vehicleId;

      Customer.updateOne(
        {
          coustomerMobile: req.body.mobile,
          serviceCenterId: req.user.serviceCenter._id,
        },
        { $push: { vehicles: serviceCenterVehicle } },

        function (err, res) {
          if (err) throw err;
          console.log("Add Vehicle to service center user");
        }
      );

      res.status(200).send("vehicle added and user updated successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
