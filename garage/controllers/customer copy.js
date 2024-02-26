// bring supplier models
const { validationResult } = require("express-validator");
const Customer = require("../../models/Customers");
var ObjectId = require("mongodb").ObjectID;

exports.addCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const CustomerData = req.body;
    CustomerData.serviceCenterId = req.user.serviceCenter._id;

    const customer = await Customer.findOne({
      coustomerMobile: CustomerData.coustomerMobile,
      serviceCenterId: req.user.serviceCenter._id,
    });

    if (customer) {
      return res.status(400).send("Customer Already Exists");
    } else {
      const newCustomer = new Customer(CustomerData);
      await newCustomer.save();
      return res.status(200).send("Customer has been saved successfully");
    }

    // return;
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error");
  }
};

// get all customers of a service center

exports.getAllCustomers = async (req, res) => {
  console.log("Loading all Customers...");
  try {
    const customers = await Customer.find({
      serviceCenterId: req.user.serviceCenter._id,
    });
    res.status(200).json(customers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// delete customer
exports.deletecustomer = async function (req, res, next) {
  try {
    const customerId = req.query.customerId;

    const customer = await Customer.findById({
      _id: ObjectId(customerId),
    });

    if (!customer) {
      return res.status(400).json({ msg: "There is no customer" });
    } else {
      // check user and condition demorgan's law
      if (customer.serviceCenterId.toString() !== req.user.serviceCenter._id) {
        return res
          .status(401)
          .json({ msg: "User not authorized to delete this customer" });
      } else {
        const deleteResult = await Customer.deleteOne({
          _id: ObjectId(customerId),
        });
        res.status(200).send("customer has been deleted");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// update customer
exports.updateCustomer = async function (req, res, next) {
  try {
    //search for already registered vehicles in db
    const { customerId, mobile, coustomerName, vehicle } = req.body;

    let customer = await Customer.findById({
      _id: ObjectId(customerId),
    });

    if (!customer) {
      return res.status(400).json({ msg: "There is no customer" });
    } else {
      // check user and condition demorgan's law
      if (customer.serviceCenterId.toString() !== req.user.serviceCenter._id) {
        return res
          .status(401)
          .json({ msg: "User not authorized to update this Customer" });
      } else {
        if (mobile) customer.coustomerMobile = mobile;
        if (coustomerName) customer.coustomerName = coustomerName;
        if (vehicle.make) customer.vehicle.make = vehicle.make;
        if (vehicle.make_name) customer.vehicle.make_name = vehicle.make_name;
        if (vehicle.model) customer.vehicle.model = vehicle.model;
        if (vehicle.model_name)
          customer.vehicle.model_name = vehicle.model_name;
        if (vehicle.registationNumber)
          customer.vehicle.registationNumber = vehicle.registationNumber;

        await customer.save();

        // console.log("Booking was successfully updated");
        res.status(200).send("customer updated");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
