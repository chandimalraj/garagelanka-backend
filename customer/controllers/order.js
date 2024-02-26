const { validationResult } = require("express-validator");
const Order = require("../../models/Order");
const ServiceCenter = require("../../models/ServiceCenter");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

// place order quentity update

const partsOrder = require("../../Functions/partsOrder");

// place an order

exports.placeOrder = async (req, res) => {
  const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  // console.log("order details");
  // console.log("order", req.body.subOrders[0].items);

  try {
    const newOrder = new Order(req.body);
    newOrder.timeStamps.placed = new Date();

    const result = await newOrder.save();
    // update parts quentity
    const updateType = "dec";
    partsOrder.updatePartQuntity(req.body.subOrders, updateType, res);

    // res.json({ msg: "Order Placed Successfully", result });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get order for customer

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const id = req.user.id;

    if (!id) return res.status(400).send("User id is Required");
    if (!ObjectId.isValid(id))
      return res.status(400).send("Invalid customer Id Id");

    const result = await Order.find({ "customer.customerId": id }).populate({
      model: "service_center",
      path: "subOrders.serviceCenter",
    });
    if (result.length == 0) return res.status(404).send("No order found");

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get order by id

exports.getOrdersById = async (req, res) => {
  try {
    const id = req.query.orderId;
    const userId = req.user.id;

    if (!id) return res.status(400).send("Order id is Required");
    if (!ObjectId.isValid(id)) return res.status(400).send("Invalid Order Id");

    const result = await Order.findById(id);
    if (result.lenghth == 0) return res.status(404).send("No order found");
    else if (result.customer.customerId != req.user.id) {
      return res
        .status(403)
        .send(
          "Invalid attempt you are not autherized to see another users ordrs"
        );
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.deleteOrderByOrderId = async (req, res) => {
  try {
    const id = req.query.orderId;
    const subOrderId = req.query.subOrderId;
    const userId = req.user.id;

    if (!id) return res.status(400).send("Order id is Required");
    if (!subOrderId) return res.status(400).send("subOrder id is Required");

    if (!ObjectId.isValid(id)) return res.status(400).send("Invalid Order Id");

    const result = await Order.findById(id);
    console.log("order", result);

    if (result.lenghth == 0) return res.status(404).send("No order found");
    else if (result.customer.customerId != userId) {
      return res
        .status(403)
        .send(
          "Invalid attempt you are not autherized to see another users ordrs"
        );
    } else {
      // filter the suborder for delete
      const subOrderforDelete = await result.subOrders.filter(
        (order) => order._id == subOrderId
      );

      const rredusingCost = subOrderforDelete[0].total;

      // filter suborders for remaining
      const remainingSubOrders = await result.subOrders.filter(
        (order) => order._id != subOrderId
      );

      console.log("Remaining Order", remainingSubOrders);
      console.log("deleteed sub order cost", rredusingCost);

      result.total = await (result.total - rredusingCost);
      result.subOrders = await remainingSubOrders;

      await result.save();

      // decrease parts quentity and delete the order
      const updateType = "inc";
      partsOrder.decresePartQuntity(
        result._id,
        subOrderforDelete,
        updateType,
        res
      );
    }

    // console.log("order", result);
    // res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
