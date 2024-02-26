const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const ServiceCenter = require("../../models/ServiceCenter");
const District = require("../../models/District");
const itemExpenseModel = require("../../models/ItemsExpense");

exports.addItemsExpenseBill = async (req, res) => {
  const errors = validationResult(req);

  console.log("User", req.user)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      service_center_id,
      item_list,
      total_amount,
      category,
      billing_date,
      description,
    } = req.body;

    //To-do - need to add role base permission
    if (service_center_id != req.user.serviceCenter._id) {
      console.log(
        " Cannot allow to add a billing due to this billing has not made by this service center : " +
          req.user.serviceCenterID
      );
      return res.status(400).json({
        msg: "Cannot confirm billing due to this billing has not made by this service center",
      });
    } else {

      const service_center = await ServiceCenter.findById(service_center_id);
      const district = await District.findById(service_center.district_id);

      const district_name = district.name_en;

      const model = `${district_name}__items_expense`;
      const modelLower = model.toLowerCase();
      console.log("model :", modelLower);
      
      const ExpenseBill = itemExpenseModel(modelLower); //create collection
      const billingItem = new ExpenseBill({});

      billingItem.service_center_id = service_center_id;
      billingItem.item_list = item_list;
      billingItem.billing_date = billing_date;
      billingItem.category = category;
      billingItem.total_amount = total_amount;
      billingItem.description = description;

      item_list.map((obj, i) => {
        // console.log("item_name", obj.item_name);
        // console.log("brand", obj.brand);
        // console.log("item_code", obj.item_code);
        // console.log("qnt", obj.qnt);
        // console.log("unit", obj.unit);
        // console.log("unit_price", obj.unit_price);
        // console.log("desc", obj.desc);
        // console.log("total", obj.total);
        billingItem.item_list.push(obj);
      });

      await billingItem.save();

      res.json({ status: "ok" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
