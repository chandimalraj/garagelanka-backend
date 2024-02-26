const { validationResult } = require("express-validator");
var ObjectId = require("mongodb").ObjectID;
const { v1 } = require("uuid");

const District = require("../../models/District");
const serviceBillModel = require("../../models/ServiceBillingItem");
const Vehicle = require("../../models/Vehicle");
const partModel = require("../../models/Parts");
const ServiceRecord = require("../../models/ServiceRecord");
const User = require("../../models/User");

const ServiceCenter = require("../../models/ServiceCenter");

exports.addServiceBill = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { bookingRef, serviceCenterId, billingDate, itemList, vehicleRegNo } =
      req.body;

    const user = req.user;

    // if (serviceCenterId != user.serviceCenter._id) {
    //   console.log(
    //     " Cannot allow to add a billing due to this billing has not made by this service center : " +
    //       user.serviceCenter
    //   );
    //   return res.status(400).json({
    //     msg: "Cannot confirm blling due to this billing has not made by this service center",
    //   });
    // }
    //if booking reference is available check whether billing done by the service center which placed the booking
    // if (bookingRef) {
    //   const booking = await Booking.findById(bookingRef);
    //   if (!booking) {
    //     return res.status(400).json({
    //       msg: "Invalid booking",
    //     });
    //   }
    //   if (booking.serviceCenterID != user.serviceCenter._id) {
    //     console.log(
    //       " Cannot confirm billing due to this billing has not made by for the service center : " +
    //         booking.service_center_id
    //     );
    //     return res.status(400).json({
    //       msg: "Cannot confirm billing due to this billing has not made by for the service center which placed the booking",
    //     });
    //   }
    // }

    vehicleRegNo
      ? (req.body.registeredCustomer = true)
      : (req.body.registeredCustomer = false);

    const district = await District.findById(user.serviceCenter.district_id);
    const districtName = district.name_en;

    const model = `${districtName}__service_bill`;
    const modelLower = model.toLowerCase();

    const ServiceBill = serviceBillModel(modelLower); //create collection
    const serviceBillingItem = new ServiceBill(req.body);

    console.log("Service billing item", serviceBillingItem);

    serviceBillingItem.billingDate = new Date(billingDate).toISOString();

    serviceBillingItem.invoiceNo = v1();
    console.log("serviceBillingItem.invoiceNo", serviceBillingItem.invoiceNo);

    //add service bill
    if (req.body.bookingRef != null) {
      serviceBillingItem.billingType = "GL"; // booking made through GarageLanka
    }

    const savedBill = await serviceBillingItem.save();

    // add service records to vehicle

    if (vehicleRegNo) {
      const vehicleResult = await Vehicle.findOne({ vehicleId: vehicleRegNo });
      if (vehicleResult) {
        // add service record
        const record = req.body;
        record.finalAmount = record.finalAmount;
        record.vehicle = vehicleResult._id;
        record.billId = savedBill._id;

        // get the service Center
        const serviceCenter = await ServiceCenter.findById({
          _id: ObjectId(user.serviceCenter._id),
        });

        record.serviceCenter = serviceCenter;

        const newServiceRecord = new ServiceRecord(record);

        const serviceRecord = await newServiceRecord.save();

        // add to vehicle records

        let records = vehicleResult.serviceRecords;
        records.push(serviceRecord._id);
        vehicleResult.serviceRecords = records;
        vehicleResult.lastServiceDate = Date.now();
        if (vehicleResult.odometer <= record.mileage) {
          vehicleResult.odometer = record.mileage;
        } else {
          res.status(400).json({
            msg: `you can not provide low millage than  ${vehicleResult.odometer}`,
          });
        }

        vehicleResult.lastServiceDate = Date.now;
        await vehicleResult.save();
      }
    }

    if (itemList.length > 0) {
      //update the inventory

      const itemModel = req.user.serviceCenter._id;
      const Item = partModel(itemModel);

      itemList.forEach(async (item) => {
        const inventoryItem = await Item.findOne({
          barcodeNumber: item.barcode,
        });
        if (inventoryItem) {
          inventoryItem.totalQuntity =
            inventoryItem.totalQuntity - parseInt(item.qnt);
          inventoryItem.inventoryQuntity =
            inventoryItem.inventoryQuntity - parseInt(item.qnt);

          await inventoryItem.save();
        }
      });
    }

    res.status(200).json({ invoiceNo: savedBill._id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getServiceBillsById = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const district = await District.findById(user.serviceCenter.district_id);
    const districtName = district.name_en;
    console.log(district);
    const model = `${districtName}__service_bill`;
    const modelLower = model.toLowerCase();

    const ServiceBill = serviceBillModel(modelLower); //create collection

    const serviceBill = await ServiceBill.findById(id);

    res.status(200).json(serviceBill);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get service bills with paginate by service center
exports.getServiceBillsByServiceCenter = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = req.user;

    const district = await District.findById(user.serviceCenter.district_id);
    const districtName = district.name_en;

    const model = `${districtName}__service_bill`;
    const modelLower = model.toLowerCase();

    const ServiceBill = serviceBillModel(modelLower); //create collection

    //  pagination
    let limit = 2;
    let page = 1;
    const condition = {
      serviceCenterId: user.serviceCenter._id,
    };

    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number should be grater than or equal 1" });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }
    }

    // calculate offset
    const offset = limit * (page - 1);

    const serviceBills = await ServiceBill.paginate(condition, {
      offset: offset,
      limit: limit,
    });

    // check whether service bill have been had on requested page
    if (serviceBills.docs.length === 0) {
      return res.status(404).json({ msg: "service bills not found" });
    } else {
      res.status(200).json(serviceBills);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getServiceBillsByDate = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = req.user;

    const district = await District.findById(user.serviceCenter.district_id);
    const districtName = district.name_en;

    const model = `${districtName}__service_bill`;
    const modelLower = model.toLowerCase();

    const ServiceBill = serviceBillModel(modelLower); //create collection

    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    to.setDate(to.getDate() + 1);

    //  pagination
    let limit = 2;
    let page = 1;
    const condition = {
      serviceCenterId: user.serviceCenter._id,
      billingDate: { $gte: from, $lte: to },
    };

    if (req.query.page) {
      page = req.query.page;
    }

    if (page <= 0) {
      return res
        .status(400)
        .json({ msg: "page number should be grater than or equal 1" });
    } else {
      if (req.query.limit) {
        limit = req.query.limit;
      }
    }

    // calculate offset
    const offset = limit * (page - 1);

    const serviceBills = await ServiceBill.paginate(condition, {
      offset: offset,
      limit: limit,
    });

    console.log(serviceBills.docs.length);

    res.status(200).json(serviceBills);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getVehicleData = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;

    const vehicle = await Vehicle.findOne({ vehicleId })
      .select("-serviceRecords -allow")
      .populate("user", "-vehicles -password");
    if (!vehicle) return res.status(400).json({ msg: "No Vehicle Found" });

    res.status(200).json(vehicle);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get vehicles by mobile number
exports.getVehiclesByMobileNumber = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const mobile = req.query.mobile;

  try {
    // see if whether user exists and if user is there get user
    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      res.status(404).json({ errors: [{ msg: "User not found" }] });
    } else {
      const fullName = user.firstName + " " + user.lastName;

      // get vehicles belong to user
      const vehicles = await Vehicle.find({ user: user._id });

      res
        .status(200)
        .json({ data: { fullName: fullName, vehicles: vehicles } });
    }
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
