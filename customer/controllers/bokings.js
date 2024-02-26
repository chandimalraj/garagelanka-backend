const config = require("config");
const axios = require("axios");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const {
  generateTimeSlots,
  DateRange,
  TimeRange,
  TimeInterval,
  provideDateAdapter,
  // excludeTimeSlots,
} = require("@gund/time-slots");

const { excludeTimeSlots } = require("@gund/time-slots");
const { dateFnsAdapter } = require("@gund/time-slots/date-adapter/date-fns");

provideDateAdapter(dateFnsAdapter);
const Booking = require("../../models/Bookings");
const Vehicle = require("../../models/Vehicle");
const User = require("../../models/User");
const ServiceCenter = require("../../models/ServiceCenter");

// insert vehicle fuctions
const vehicleFunctions = require("./functions/vehicle");

// vehicle service type function
const serviceTypefunction = require("../controllers/functions/servicetypes");

// Account userID and Api Key sender ID
const userId = config.get("notify_user_id");
const api_key = config.get("notify_api_key");
const sender_id = config.get("notify_sender_id");
// add bookings with service type id
exports.createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      serviceCenterID,
      serviceTypeId,
      colorCode,
      mobile,
      vehicleRegNo,
      vehicleID,
      vehicleMakeID,
      vehicleModelID,
      vehicleModelName,
      serviceType,
      startDate,
      endDate,
      description,
      addToAllowedList,
    } = req.body;

    console.log("booking details", req.body);

    const { firstName, lastName } = req.user;
    let bookingDate = new Date(startDate).toDateString();

    // Build Booking Object
    const bookingFields = {};

    bookingFields.serviceCenterID = serviceCenterID;
    bookingFields.serviceTypeId = serviceTypeId;
    bookingFields.colorCode = colorCode;
    bookingFields.bookingType = "coustomer";
    bookingFields.user = req.user.id;
    bookingFields.userFirstName = firstName;
    bookingFields.userLastName = lastName;
    bookingFields.mobile = mobile;
    bookingFields.vehicleRegNo = vehicleRegNo;
    bookingFields.vehicleID = vehicleID;
    bookingFields.vehicleMakeID = vehicleMakeID;
    bookingFields.vehicleModelID = vehicleModelID;
    bookingFields.vehicleModelName = vehicleModelName;
    bookingFields.serviceType = serviceType;
    bookingFields.bookingDate = new Date(bookingDate).toISOString();
    bookingFields.startDate = new Date(startDate).toISOString();
    bookingFields.endDate = new Date(endDate).toISOString();
    bookingFields.description = description;

    // console.log(bookingFields);

    booking = new Booking(bookingFields);

    console.log("Booking details with jana ", booking);

    await booking.save();

    // send success sms to user

    // find service center name
    console.log("service center", serviceCenterID);
    let servicecenter = await ServiceCenter.findById({
      _id: ObjectId(serviceCenterID),
    });

    if (servicecenter) {
      console.log("service center found");
    } else {
      console.log("there is no service center");
    }

    //  get service center details
    const serviceCenterName = servicecenter.name;
    let serviceCenterMobile = servicecenter.contact_no_mobile;
    let allow = "without permission";
    // Add service center to vehicle allow list
    if (addToAllowedList) {
      if (
        vehicleFunctions.addPermission(
          vehicleID,
          serviceCenterID,
          serviceCenterName
        )
      ) {
        allow = "with permission";
      } else {
        return res.status(500).json({
          msg: "error in adding service center to allow list",
        });
      }
    }

    // rearranging mobile numbers to send sms
    serviceCenterMobile = serviceCenterMobile.substring(1);
    serviceCenterMobile = "94".concat(serviceCenterMobile);

    var smsmobile = mobile.substring(1);
    smsmobile = "94".concat(smsmobile);

    // send msg notify to user
    const msg = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: smsmobile,
      message: `Your appointment has been successfully saved  at ${serviceCenterName} for ${serviceType} at ${startDate}`,
    });

    // console.log("msg ", msg);

    // send msg to owner
    const serviceCenterMessage = await axios.post(
      "https://app.notify.lk/api/v1/send",
      {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: serviceCenterMobile,
        message: `You got a new appoinment  for  ${serviceType} to ${vehicleModelName} for ${firstName} mobile ${mobile} at ${startDate}`,
      }
    );

    console.log("owner msg ", serviceCenterMessage);

    res.status(200).json({
      msg: `Your appointment has been saved successfully ${allow} to access your vehicle service recodes`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Create instanse booking

exports.createInstanceBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      serviceCenterID,
      serviceTypeId,
      colorCode,
      firstName,
      mobile,
      vehicleRegNo,
      vehicleID,
      vehicleMakeID,
      vehicleModelID,
      vehicleModelName,
      serviceType,
      startDate,
      endDate,
      description,
      addToAllowedList,
    } = req.body;

    // const { firstName, lastName } = req.user;
    let bookingDate = new Date(startDate).toDateString();

    // Build Booking Object
    const bookingFields = {};

    bookingFields.serviceCenterID = serviceCenterID;
    bookingFields.serviceTypeId = serviceTypeId;
    bookingFields.colorCode = colorCode;
    bookingFields.bookingType = "coustomer";
    bookingFields.user = null;
    bookingFields.userFirstName = firstName;
    bookingFields.userLastName = "guest";
    bookingFields.mobile = mobile;
    bookingFields.vehicleRegNo = vehicleRegNo;
    bookingFields.vehicleID = vehicleID;
    bookingFields.vehicleMakeID = vehicleMakeID;
    bookingFields.vehicleModelID = vehicleModelID;
    bookingFields.vehicleModelName = vehicleModelName;
    bookingFields.serviceType = serviceType;
    bookingFields.bookingDate = new Date(bookingDate).toISOString();
    bookingFields.startDate = new Date(startDate).toISOString();
    bookingFields.endDate = new Date(endDate).toISOString();
    bookingFields.description = description;

    // console.log(bookingFields);

    booking = new Booking(bookingFields);

    // console.log(booking);

    await booking.save();

    // send success sms to user

    // find service center name
    console.log("service center", serviceCenterID);
    let servicecenter = await ServiceCenter.findById({
      _id: ObjectId(serviceCenterID),
    });

    //  get service center details
    const serviceCenterName = servicecenter.name;
    let serviceCenterMobile = servicecenter.contact_no_mobile;
    let allow = "without permission";

    // rearranging mobile numbers to send sms
    serviceCenterMobile = serviceCenterMobile.substring(1);
    serviceCenterMobile = "94".concat(serviceCenterMobile);

    var smsmobile = mobile.substring(1);
    smsmobile = "94".concat(smsmobile);

    // send msg notify to user
    const msg = await axios.post("https://app.notify.lk/api/v1/send", {
      user_id: userId,
      api_key: api_key,
      sender_id: sender_id,
      to: smsmobile,
      message: `Your appointment has been successfully saved  at ${serviceCenterName} for ${serviceType} at ${startDate}`,
    });

    // console.log("msg ", msg);

    // send msg to owner
    const serviceCenterMessage = await axios.post(
      "https://app.notify.lk/api/v1/send",
      {
        user_id: userId,
        api_key: api_key,
        sender_id: sender_id,
        to: serviceCenterMobile,
        message: `You got a new appoinment  for  ${serviceType} to ${vehicleModelName} for guest ${firstName} mobile ${mobile} at ${startDate}`,
      }
    );

    console.log("owner msg ", serviceCenterMessage);

    res.status(200).json({
      msg: `Your appointment has been saved successfully ${allow} to access your vehicle service recodes`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getBookingsByServiceCenterIDandDateRange = async function (
  req,
  res,
  next
) {
  try {
    const sc_id = req.query.sc_id;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    console.log(
      "start time",
      new Date(new Date(startDate).setHours(00, 00, 00)).toISOString()
    );
    console.log(
      "end time",
      new Date(new Date(endDate).setHours(00, 00, 00)).toISOString()
    );

    const bookings = await Booking.find({
      serviceCenterID: sc_id,
      // bookingDate: {
      //   $gte: new Date(new Date(startDate).setHours(00, 00, 00)).toISOString(),
      //   $lt: new Date(new Date(endDate).setHours(23, 59, 59)).toISOString(),
      // },
    });

    if (!bookings) {
      return res
        .status(404)
        .json({ msg: "There is no bookings for service center" });
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// booking logic garage

exports.getBookingsByServiceCenterIDandDateRangeServiceTypeId = async function (
  req,
  res,
  next
) {
  try {
    const serviceCenterID = req.query.serviceCenterID;
    // start time of the day
    const startDate = req.query.start_date;
    // end time of the day
    const endDate = req.query.end_date;
    const servicetypeId = req.query.servicetypeId;

    // to find the restried time slots
    const serviceTypeDetails =
      await serviceTypefunction.getserviceTypeDetailsofaServiceCenter(
        serviceCenterID,
        servicetypeId
      );

    // console.log("serviceTypeDetails", serviceTypeDetails);

    const maximumParallel =
      serviceTypeDetails.selectedServiceType.maximumParallel;
    console.log("maximum paeallel slots", maximumParallel);

    const bookings = await Booking.find(
      {
        serviceCenterID: serviceCenterID,
        startDate: {
          $gte: startDate,
          $lt: endDate,
        },
        serviceTypeId: servicetypeId,
      },
      { startDate: 1, endDate: 1 }
    ).sort({ startDate: 1 });

    if (!bookings) {
      return res
        .status(200)
        .json({ msg: "There is no bookings for service center" });
    }

    // console.log("bookings", bookings);

    let stDte, enDte;
    const from = "from";
    const to = "to";

    let restrictArray = [];
    for (x = 0; x < bookings.length; x++) {
      let count = 1;
      let restrictObj = {};

      // console.log("bookings in for loop", bookings[x]);

      // if (bookings[x].startDate < bookings[x].endDate) {
      //   console.log("start < end");
      // }

      // console.log("done to this");
      stDte = bookings[x].startDate;
      // console.log("that error start date", bookings[x].startDate);
      // console.log("start date", bookings[x].startDate);
      enDte = bookings[x].endDate;
      // console.log("that error end date", bookings[x].endDate);

      console.log("maximumParallel ", maximumParallel);
      console.log("count ", count);

      if (count >= maximumParallel) {
        restrictObj[from] = bookings[x].startDate;
        restrictObj[to] = bookings[x].endDate;

        restrictArray.push(restrictObj);

        console.log("true");
      } else {
        for (y = x + 1; y < bookings.length; y++) {
          if (
            bookings[x].startDate <= bookings[y].startDate &&
            bookings[y].startDate <= bookings[x].endDate
          ) {
            count = count + 1;

            console.log("count in inner loop", count);

            if (count >= maximumParallel) {
              restrictObj[from] = bookings[y].startDate;
              restrictObj[to] = bookings[x].endDate;

              restrictArray.push(restrictObj);
              console.log("breake run");
              break;
            }
          }
        }
      }
    }

    // calculate the time slots

    // calculate open and closing time of the service center

    const openHours = serviceTypeDetails.servicCenterOpenTime.getHours();
    const openMinutes = serviceTypeDetails.servicCenterOpenTime.getMinutes();

    const closeHours = serviceTypeDetails.servicCenterCloseTime.getHours();
    const closeMinutes = serviceTypeDetails.servicCenterCloseTime.getMinutes();

    // calsulate the time interval

    const timeInterval =
      serviceTypeDetails.selectedServiceType.requiredTimeSlots * 15;

    // console.log("time interval", timeInterval);

    const slots = generateTimeSlots(
      DateRange.fromDates(new Date(startDate), new Date(startDate)),
      TimeRange.fromTimeStrings(
        `${openHours}:${openMinutes}`,
        `${closeHours}:${closeMinutes}`
      ),
      TimeInterval.minutes(timeInterval)
    );

    // add availability parameter and send timeslots as one array

    const allSlots = [];
    const bookedSlots = [];

    let newSlots = JSON.stringify(slots);
    newSlots = JSON.parse(newSlots);

    // console.log("time slots : ", newSlots);
    // console.log("restricted array ", restrictArray);

    // Add a new parameter to each object in the array
    newSlots.forEach((obj) => {
      obj.availability = true;
    });

    restrictArray.forEach((obj) => {
      obj.availability = false;
    });

    console.log("time slots : ", newSlots);

    // const availableSlots = excludeTimeSlots(newSlots, restrictArray);

    // Result will have only slots from `allSlots` that
    // do not intersect with any slots in `bookedSlots`
    // console.log(availableSlots);

    let limeslots = newSlots.concat(restrictArray);

    // limeslots = limeslots.sort((a, b) => a.from - b.from);

    res.status(200).json({ timeSlots: limeslots });
  } catch (error) {
    console.error(error.message);
    res.send("Server error");
  }
};

exports.getBookingsByUserID = async function (req, res, next) {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("serviceCenterID", "name")
      .populate("serviceTypeId")
      .populate("vehicleID", "vehicleId make_name model_name year img_url");

    if (!bookings) {
      return res
        .status(404)
        .json({ msg: "There is no bookings for this user" });
    }

    res.status(200).json({ Bookings: bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.deleteBookingbyBookingId = async function (req, res, next) {
  try {
    const booking_id = req.query.booking_id;

    const booking = await Booking.findById({
      _id: ObjectId(booking_id),
    });

    if (!booking) {
      return res.status(404).json({ msg: "There is no booking" });
    } else {
      // check user and condition demorgan's law
      if (
        booking.user.toString() !== req.user.id &&
        booking.serviceCenterID.toString() !== req.user.serviceCenterID
      ) {
        return res
          .status(403)
          .json({ msg: "User not authorized to delete this booking" });
      } else {
        const deleteResult = await Booking.deleteOne({
          _id: ObjectId(booking_id),
        });
        console.log(
          `${deleteResult.deletedCount} document(s) was/were deleted.`
        );
        res.status(200).send("booking rcode Deleted");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
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
          .status(403)
          .json({ msg: "User not authorized to update this booking" });
      } else {
        if (mobile) booking.mobile = mobile;
        if (serviceType) booking.serviceType = serviceType;
        if (description) booking.description = description;

        await booking.save();

        console.log("Booking was successfully updated");
        res.status(200).send("booking rcode updated");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
