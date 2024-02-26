// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const ServiceRecord = require("../../models/ServiceRecord");
const Booking = require("../../models/Bookings");
const Vehicle = require("../../models/Vehicle");

// exports.loadAllSearviceRecords = async (req, res) => {
//   console.log("Loading all service records...");
//   try {
//     await ServiceRecord.find(function (err, result) {
//       if (err) return next(err);
//       res.status(200).json(result);
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };

exports.getServiceRecordsByUser = async function (req, res) {
  try {
    const user = req.user;

    const serviceRecords = await ServiceRecord.find({
      "customer.mobile": user.mobile,
    })
      .populate("bookingRef")
      .populate("serviceCenterId")
      .populate("vehicle")
      .populate("serviceList.serviceTypeID");

    if (!serviceRecords || serviceRecords.length === 0) {
      return res
        .status(404)
        .json({ msg: "No service record found for the booking" });
    } else {
      return res.status(200).json({ serviceRecords });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
//get service records for perticular vehicle(vehicle id)

exports.getServiceRecordsByVehicleId = async function (req, res) {
  try {
    vehicleId = req.query.vehicleId;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ msg: "No Vehicle found" });
    }

    if (req.user.id != vehicle.user) {
      return res.status(400).json({ msg: "Access Denied" });
    } else {
      const serviceRecords = await ServiceRecord.find({
        vehicle: vehicleId,
      })
        .populate("booking", Booking)
        .populate("service_center", ServiceCenter)
        .populate("vehicle", Vehicle);

      if (serviceRecords.length == 0) {
        return res.status(404).json({ msg: "No service records found" });
      } else {
        return res.status(200).json({ serviceRecords });
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

//get service record for a perticular booking(booking id)

exports.getServiceRecordById = async function (req, res) {
  try {
    const id = req.query.serviceRecordId;

    const serviceRecord = await ServiceRecord.findById(id)
      .populate("bookingRef")
      .populate(
        "serviceCenterId",
        "_id name address contact_no_1 contact_no_mobile"
      )
      .populate("vehicle")
      .populate("serviceList.serviceTypeID");

    if (!serviceRecord) {
      return res.status(404).json({ msg: "No service record found" });
    } else {
      return res.status(200).json({ serviceRecord });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.getServiceRecordsByBookingId = async function (req, res) {
  try {
    const booking_id = req.params.id;

    const serviceRecord = await ServiceRecord.findOne({
      bookingRef: ObjectId(booking_id),
    })
      .populate("bookingRef")
      .populate("serviceCenterId")
      .populate("vehicle")
      .populate("serviceList.serviceTypeID");

    if (!serviceRecord) {
      return res
        .status(404)
        .json({ msg: "No service record found for the booking" });
    } else {
      return res.status(200).json({ serviceRecord });
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.updateServiceRecord = async (req, res) => {
  console.log("Updating service record...");
  try {
    let serviceRecord = await ServiceRecord.findById(req.body.recordID);
    serviceRecord.status = req.body.status;
    await serviceRecord.save();

    res
      .status(200)
      .json({ msg: `Service record status updated to ${req.body.status}` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.addServiceRecord = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Add service record to DB

    const {
      booking_ref,
      service_types, //obj arr
      item_list, //obj arr
      service_date,
      total_amount,
      vehicle_id,
      description,
      mileage,
    } = req.body;
    console.log("Service Record saving , booking ref: " + booking_ref);
    console.log("Service Record saving , vehicle :  " + vehicle_id);
    console.log("555666 ");
    //Check whether booking was registered from same service center
    // const booking = await Booking.findById({_id: ObjectId(booking_ref),});

    const booking = await Booking.findById({
      _id: ObjectId(booking_ref),
    });

    if (!booking) {
      return res.status(400).json({ msg: "There is no booking" });
    } else {
      console.log("8888 ");
      console.log("booking sc_id : " + booking.serviceCenterID);
      console.log("Req sc_id : " + req.user.serviceCenterID);

      if (booking.serviceCenterID != req.user.serviceCenterID) {
        console.log(
          " Cannot confirm booking due to tis booking has not made by this service center : " +
            req.user.serviceCenterID
        );
        return res.status(400).json({
          msg: "Cannot confirm booking due to tis booking has not made by this service center",
        });
      } else {
        serviceRecord = new ServiceRecord({
          booking_ref,
          service_types,
          item_list,
          service_date,
          total_amount,
          vehicle_id,
          description,
          mileage,
        });

        service_types.map((obj, i) => {
          console.log("service_type", obj.service_type);
          console.log("service_cost", obj.service_cost);
          console.log("number_of_hrs", obj.number_of_hrs);
          console.log("total", obj.total);
          serviceRecord.service_types.push(obj);
        });

        item_list.map((obj, i) => {
          console.log("item_code", obj.item_code);
          console.log("desc", obj.desc);
          console.log("unitPrice", obj.unitPrice);
          console.log("qnt", obj.qnt);
          console.log("total", obj.total);
          serviceRecord.item_list.push(obj);
        });

        //Add new service record
        serviceRecord.booking_ref(booking_ref);
        serviceRecord.service_date(service_date);
        serviceRecord.total_amount(total_amount);
        serviceRecord.vehicle_id(vehicle_id);
        serviceRecord.description(description);
        serviceRecord.mileage(mileage);

        await serviceRecord.save();

        res.json({ status: "ok" });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
