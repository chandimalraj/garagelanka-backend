const ServiceCenter = require("../../models/ServiceCenter");
const { validationResult } = require("express-validator");
const Order = require("../../models/Order");
const mongoose = require("mongoose");
const partModel = require("../../models/Parts");
const Category = require("../../models/Category");

// place order quentity update

const partsOrderfunction = require("../../Functions/partsOrder");

// get suborder by id

exports.getOrdersById = async (req, res) => {
  try {
    const { serviceCenter } = req.user;
    const id = req.params.id;

    if (!id) return res.status(400).send("Suborder id is Required");
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid Suborder Id");

    const result = await Order.aggregate([
      {
        $project: {
          subOrders: {
            $filter: {
              input: "$subOrders",
              as: "order",
              cond: {
                $and: [
                  { $eq: ["$$order._id", mongoose.Types.ObjectId(id)] },
                  {
                    $eq: [
                      "$$order.serviceCenter",
                      mongoose.Types.ObjectId(serviceCenter._id),
                    ],
                  },
                ],
              },
            },
          },
          customer: "$$ROOT.customer",
        },
      },
      {
        $unwind: "$subOrders",
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get suborders for service center

exports.getOrdersByServiceCenter = async (req, res) => {
  try {
    const { serviceCenter } = req.user;
    const { status } = req.query;

    console.log("status", status);

    if (!status) return res.status(400).send("Status id is Required");

    const result = await Order.aggregate([
      {
        $project: {
          subOrders: {
            $filter: {
              input: "$subOrders",
              as: "order",
              cond: {
                $and: [
                  { $eq: ["$$order.sellerStatus", status] },
                  {
                    $eq: [
                      "$$order.serviceCenter",
                      mongoose.Types.ObjectId(serviceCenter._id),
                    ],
                  },
                ],
              },
            },
          },
          customer: "$$ROOT.customer",
        },
      },
      {
        $unwind: "$subOrders",
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// update suborder

exports.updateSuborder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("came");

    const id = req.query.orderId;
    const subOrderId = req.query.subOrderId;

    if (!id) return res.status(400).send("orderId is Required");
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).send("Invalid orderId");

    if (!subOrderId) return res.status(400).send("subOrderId is Required");
    if (!mongoose.Types.ObjectId.isValid(subOrderId))
      return res.status(400).send("Invalid subOrderId");

    const partsOrder = await Order.findById(id);

    if (partsOrder) {
      console.log("order ", partsOrder);
    }

    const {
      sellerStatus,
      orderTotal,
      deliveryCost,
      discount,
      subTotal,
      sellerNotes,
    } = req.body;

    if (sellerStatus == "Reject") {
      // const suborder = await Order.aggregate([
      //   {
      //     $project: {
      //       _id: 0,
      //       subOrders: {
      //         $filter: {
      //           input: "$subOrders",
      //           as: "order",
      //           cond: {
      //             $eq: ["$$order._id", mongoose.Types.ObjectId(id)],
      //           },
      //         },
      //       },
      //     },
      //   },
      //   {
      //     $unwind: "$subOrders",
      //   },
      // ]);
      // const items = suborder[0].subOrders.items;
      // // part model
      // const itemModel = req.user.serviceCenter._id;
      // const Item = partModel(itemModel);
      // // update quantities
      // items.forEach(async (item) => {
      //   // update the service center local inventory
      //   const inventoryItem = await Item.findOne({
      //     barcodeNumber: item.barcode,
      //   });
      //   console.log("item found in online selling catergory", inventoryItem);
      //   // inventoryItem.totalQuntity =
      //   //   inventoryItem.totalQuntity + parseInt(item.qnt);
      //   // inventoryItem.onlineSellingQuntity =
      //   //   inventoryItem.onlineSellingQuntity + parseInt(item.qnt);
      //   // await inventoryItem.save();
      //   // update the online selling category
      //   // update online selling catergory
      //   const category = await Category.findById(item.categoryId);
      //   const model = category.name.toLowerCase();
      //   console.log("online selling category", model);
      //   const Part = partModel(model);
      //   console.log("online selling category Part", Part);
      //   const result = await Part.findById(item.categoryId);
      // });

      // filter the suborder for delete
      const subOrderforDelete = await partsOrder.subOrders.filter(
        (order) => order._id == subOrderId
      );

      const rredusingCost = subOrderforDelete[0].total;

      // filter suborders for remaining
      const remainingSubOrders = await partsOrder.subOrders.filter(
        (order) => order._id != subOrderId
      );

      console.log("suborders for delete", subOrderforDelete);
      console.log("Remaining Order", remainingSubOrders);
      console.log("deleteed sub order cost", rredusingCost);

      partsOrder.total = await (partsOrder.total - rredusingCost);
      partsOrder.subOrders = await remainingSubOrders;

      await partsOrder.save();

      // decrease parts quentity and delete the order
      const updateType = "inc";
      partsOrderfunction.decresePartQuntity(
        partsOrder._id,
        subOrderforDelete,
        updateType,
        res
      );
    } else {
      const update = await Order.updateOne(
        {
          subOrders: {
            $elemMatch: { _id: { $eq: mongoose.Types.ObjectId(subOrderId) } },
          },
        },
        {
          $set: {
            total: orderTotal,
            "subOrders.$.sellerStatus": sellerStatus,
            "subOrders.$.deliveryCost": deliveryCost,
            "subOrders.$.discount": discount,
            "subOrders.$.subTotal": subTotal,
            "subOrders.$.sellerNotes": sellerNotes,
            "subOrders.$.timeStamps.reviewed": new Date(),
          },
        }
      );

      // update the inventory if  seller reject the order

      if (sellerStatus != "Reject") {
        res.status(200).json(update);
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// update suborder status

exports.updateSuborderStatus = async (req, res) => {
  try {
    const id = req.query.id;
    const { status } = req.query;

    if (!status) return res.status(400).send("Status id is Required");

    let result;
    if (status === "Dispatched") {
      result = await Order.updateOne(
        {
          subOrders: {
            $elemMatch: { _id: { $eq: mongoose.Types.ObjectId(id) } },
          },
        },
        {
          $set: {
            "subOrders.$.sellerStatus": status,
            "subOrders.$.timeStamps.dispatched": new Date(),
          },
        }
      );
    }
    if (status === "Collected") {
      result = await Order.updateOne(
        {
          subOrders: {
            $elemMatch: { _id: { $eq: mongoose.Types.ObjectId(id) } },
          },
        },
        {
          $set: {
            "subOrders.$.sellerStatus": status,
            "subOrders.$.timeStamps.collected": new Date(),
          },
        }
      );
    }

    res.status(200).json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
