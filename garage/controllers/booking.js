const config = require("config");
const axios = require("axios");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

const Booking = require("../../models/Bookings");
const ServiceCenter = require("../../models/ServiceCenter");
const Vehicle = require("../../models/Vehicle");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");

exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let {
      coustomerFirstName,
      mobile,
      vehicleRegNo,
      vehicleMakeID,
      vehicleModelID,
      vehicleModelName,
      serviceTypeId,
      colorCode,
      serviceType,
      startDate,
      endDate,
      description,
    } = req.body;

    // const { firstName, serviceCenterID } = req.user;
    let bookingDate = new Date(startDate).setHours(00);

    // Build Booking Object
    let bookingFields = {};
    bookingFields.serviceCenterID = req.user.serviceCenter._id;
    bookingFields.serviceTypeId = serviceTypeId;
    bookingFields.colorCode = colorCode;
    bookingFields.bookingType = "garage";
    bookingFields.scUser = req.user.firstName;
    bookingFields.userFirstName = coustomerFirstName;
    bookingFields.mobile = mobile;
    bookingFields.vehicleRegNo = vehicleRegNo;
    bookingFields.vehicleMakeID = vehicleMakeID;
    bookingFields.vehicleModelID = vehicleModelID;
    bookingFields.vehicleModelName = vehicleModelName;
    bookingFields.serviceType = serviceType;
    bookingFields.bookingDate = new Date(bookingDate).toISOString();
    bookingFields.startDate = new Date(startDate).toISOString();
    bookingFields.endDate = new Date(endDate).toISOString();
    bookingFields.description = description;

    // check weather vehicle is registerd or not

    let vehicle = await Vehicle.findOne({
      vehicleId: vehicleRegNo,
    });

    if (vehicle) {
      bookingFields.vehicleID = vehicle._id;
      bookingFields.user = vehicle.user;
      bookingFields.vehicleMakeID = vehicle.make;
      bookingFields.vehicleModelID = vehicle.model;
      vehicleModelName = `${vehicle.make_name}  ${vehicle.model_name}`;
      bookingFields.vehicleModelName = vehicleModelName;
    }

    // console.log(bookingFields);

    booking = new Booking(bookingFields);

    // console.log(booking);

    await booking.save();

    // send success sms to user and garage owner

    // find service center name

    let servicecenter = await ServiceCenter.findById({
      _id: ObjectId(req.user.serviceCenter._id),
    });

    const serviceCenterName = servicecenter.name;
    let serviceCenterMobile = servicecenter.contact_no_mobile;
    console.log("service center mobile ", serviceCenterMobile);
    serviceCenterMobile = serviceCenterMobile.substring(1);
    serviceCenterMobile = "94".concat(serviceCenterMobile);

    var smsmobile = mobile.substring(1);
    smsmobile = "94".concat(smsmobile);

    // send msg to coustomer
    const msg = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: smsmobile,
      message: `Your appointment has been successfully saved  at ${serviceCenterName} for ${serviceType} at ${startDate}`,
    });

    // console.log("coustomer msg ", msg);

    // send msg to owner
    const serviceCenterMessage = await axios.post(
      "https://app.notify.lk/api/v1/send",
      {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: serviceCenterMobile,
        message: `You got a new appoinment  for  ${serviceType} to ${vehicleModelName} for ${coustomerFirstName} ${mobile} at ${startDate}`,
      }
    );

    // console.log("owner msg ", serviceCenterMessage);

    res.status(200).send("Your appointment has been saved successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// find registerd vehicle

exports.loadVehiclesbyVehicleId = async function (req, res, next) {
  try {
    console.log("Loading service center by Name :" + req.query.vehicleId);
    const vehicleId = req.query.vehicleId;
    await Vehicle.find(
      { vehicleId: { $regex: "^" + vehicleId, $options: "i" } },
      function (err, result) {
        if (err) return next(err);
        res.json(result);
      }
    );
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

// get all bookings by sc id and date
exports.getBookingByServiceCenterAndDate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceCenter, Date } = req.body;

    const bookings = await Booking.find({
      serviceCenter: serviceCenter,
      Date: Date,
    });

    if (!bookings) {
      return res
        .status(400)
        .json({ msg: "There is no bookings for this date" });
    }

    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in bookings get");
  }
};

// get all bookings by sc id and date range

exports.getBookingsByServiceCenterIDandDateRange = async function (
  req,
  res,
  next
) {
  try {
    const sc_id = req.user.serviceCenter._id;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    const bookings = await Booking.find({
      serviceCenterID: sc_id,
      bookingDate: {
        $gte: new Date(new Date(startDate).setHours(00, 00, 00)).toISOString(),
        $lt: new Date(new Date(endDate).setHours(23, 59, 59)).toISOString(),
      },
    });

    if (bookings.length == 0) {
      return res
        .status(404)
        .json({ msg: "There is no bookings for service center" });
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

// delete booking
exports.deleteBookingbyBookingId = async function (req, res, next) {
  try {
    const booking_id = req.query.booking_id;

    const booking = await Booking.findById({
      _id: ObjectId(booking_id),
    });

    if (!booking) {
      return res.status(400).json({ msg: "There is no booking" });
    } else {
      // check user and condition demorgan's law
      if (booking.serviceCenterID.toString() !== req.user.serviceCenter._id) {
        return res
          .status(401)
          .json({ msg: "User not authorized to delete this booking" });
      } else {
        const deleteResult = await Booking.deleteOne({
          _id: ObjectId(booking_id),
        });
        // console.log(
        //   `${deleteResult.deletedCount} document(s) was/were deleted.`
        // );
        res.status(200).send("booking rcode Deleted");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.updateBookingbyBookingId = async function (req, res, next) {
  try {
    //search for already registered vehicles in db
    const { booking_id, mobile, serviceType, description } = req.body;

    let booking = await Booking.findById({
      _id: ObjectId(booking_id),
    });

    if (!booking) {
      return res.status(400).json({ msg: "There is no booking" });
    } else {
      // check user and condition demorgan's law
      if (
        booking.user.toString() !== req.user.id &&
        booking.serviceCenterID.toString() !== req.user.serviceCenterID
      ) {
        return res
          .status(401)
          .json({ msg: "User not authorized to update this booking" });
      } else {
        if (mobile) booking.mobile = mobile;
        if (serviceType) booking.serviceType = serviceType;
        if (description) booking.description = description;

        await booking.save();

        // console.log("Booking was successfully updated");
        res.status(200).send("booking rcode updated");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};
