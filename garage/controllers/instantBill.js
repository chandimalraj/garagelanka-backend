const config = require("config");
var ObjectId = require("mongodb").ObjectID;
var html_to_pdf = require("html-pdf-node");
const { validationResult } = require("express-validator");
const htmlTemplete = require("../invoice/htmlGenerator");

const ServiceCenter = require("../../models/ServiceCenter");
const District = require("../../models/District");
const instantBillModel = require("../../models/BillingItem");
const partModel = require("../../models/Parts");

exports.addInstantBill = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceCenterId, itemList, billingDate } = req.body;

    //To-do - need to add role base permission
    if (serviceCenterId != req.user.serviceCenter._id) {
      console.log(
        " Cannot allow to add a billing due to this billing has not made by this service center : " +
          req.user.serviceCenterID
      );
      return res.status(400).json({
        msg: "Cannot confirm billing due to this billing has not made by this service center",
      });
    } else {
      const district = await District.findById(
        req.user.serviceCenter.district_id
      );

      const district_name = district.name_en;

      const model = `${district_name}__instant_bill`;
      const modelLower = model.toLowerCase();

      const InstantBill = instantBillModel(modelLower); //create collection
      const billingItem = new InstantBill(req.body);

      billingItem.billingDate = new Date(billingDate).toISOString();

      const saved = await billingItem.save();

      //update the inventory

      const itemModel = req.user.serviceCenter._id;
      const Item = partModel(itemModel);

      itemList.forEach(async (item) => {
        const inventoryItem = await Item.findOne({
          barcodeNumber: item.barcode,
        });

        inventoryItem.totalQuntity =
          inventoryItem.totalQuntity - parseInt(item.qnt);
        inventoryItem.inventoryQuntity =
          inventoryItem.inventoryQuntity - parseInt(item.qnt);

        inventoryItem.save();
      });

      res.status(200).json({ invoiceNo: saved._id });

      // //generate invoice

      // const htmlContent = htmlTemplete(
      //   saved._id,
      //   billingItem,
      //   itemList,
      //   customer
      // );
      // //pdf options
      // let options = { format: "A4" };
      // //html content string
      // let file = { content: htmlContent };
      // //geberate pdf
      // html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
      //   res.set("Content-Type", "application/pdf");
      //   res.send(pdfBuffer);
      // });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
