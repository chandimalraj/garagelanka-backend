// bring user,vehicle models
const config = require("config");
const { validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;

const Category = require("../models/Category");
const partModel = require("../models/Parts");
const Orders = require("../models/Order");

// Load all catogories

exports.getAllCategories = async (req, res) => {
  console.log("Loading all Categories...");
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// decrese the item quntity when place the order

exports.updatePartQuntity = async (subOrders, updateType, res) => {
  // console.log("dd orders", subOrders);

  try {
    await Promise.all(
      subOrders.map(async (obj) => {
        // Perform transformation on each object
        await Promise.all(
          obj.items.map(async (item) => {
            // Perform iteration logic on each object
            // console.log("Item", item);

            // finding the item parts collection

            const category = await Category.findById(item.categoryId);
            const model = category.name.toLowerCase();
            const Part = partModel(model);

            console.log("collection name ", model);

            // finding the document

            const documentToUpdate = { _id: ObjectId(item._id) };

            // find the document and check the quy is exceed the online selling availability

            const availableOnlineSellingQuntity = await Part.findById(
              documentToUpdate
            ).select("onlineSellingQuntity -_id");

            console.log("item qty", item.qty);
            console.log(availableOnlineSellingQuntity.onlineSellingQuntity);

            if (item.qty > availableOnlineSellingQuntity) {
              res.status(400).json({
                msg: `${item.itemName} has only ${availableOnlineSellingQuntity.onlineSellingQuntity} items left please reduse the item quntity`,
              });
            } else {
              console.log("document to update", documentToUpdate);
              // define the update
              let update = null;
              if (updateType == "dec") {
                update = { $inc: { onlineSellingQuntity: -item.qty } };
              } else if (updateType == "inc") {
                update = { $inc: { onlineSellingQuntity: item.qty } };
              }

              console.log("update", update);

              // update the collection

              let result = await Part.updateOne(documentToUpdate, update);

              if (result.nModified === 1) {
                console.log("Updated one document");
              } else {
                console.log("No documents updated");
              }
            }
          })
        );
      })
    );

    res.json({ msg: "Order Placed Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// increse the item quentioty when delete the order

exports.decresePartQuntity = async (orderId, subOrders, updateType, res) => {
  console.log("dd orders", subOrders);

  try {
    await Promise.all(
      subOrders.map(async (obj) => {
        // Perform transformation on each object
        await Promise.all(
          obj.items.map(async (item) => {
            // Perform iteration logic on each object
            // console.log("Item", item);

            // finding the item parts collection

            const category = await Category.findById(item.categoryId);
            const model = category.name.toLowerCase();
            const Part = partModel(model);

            console.log("collection name ", model);

            // finding the document

            const documentToUpdate = { _id: ObjectId(item._id) };

            // find the document and check the quy is exceed the online selling availability

            const availableOnlineSellingQuntity = await Part.findById(
              documentToUpdate
            ).select("onlineSellingQuntity -_id");

            console.log("item qty", item.qty);
            console.log(availableOnlineSellingQuntity.onlineSellingQuntity);

            if (item.qty > availableOnlineSellingQuntity) {
              res.status(400).json({
                msg: `${item.itemName} has only ${availableOnlineSellingQuntity.onlineSellingQuntity} items left please reduse the item quntity`,
              });
            } else {
              console.log("document to update", documentToUpdate);
              // define the update
              let update = null;
              if (updateType == "dec") {
                update = { $inc: { onlineSellingQuntity: -item.qty } };
              } else if (updateType == "inc") {
                update = { $inc: { onlineSellingQuntity: item.qty } };
              }

              console.log("update", update);

              // update the collection

              let result = await Part.updateOne(documentToUpdate, update);

              if (result.nModified === 1) {
                console.log("Updated one document");
              } else {
                console.log("No documents updated");
              }
            }
          })
        );
      })
    );

    // delete the order by orderId

    // const documentToDelete = { _id: ObjectId(orderId) };

    // let result = await Orders.deleteOne(documentToDelete);

    // if (result.nModified === 1) {
    //   console.log("Updated one document");
    // } else {
    //   console.log("No documents updated");
    // }

    res.json({ msg: "Order deleted Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
