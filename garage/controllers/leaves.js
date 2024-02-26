const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
var otpGenerator = require("otp-generator");

const GarageUser = require("../../models/GarageUser");

// register new service type
exports.registerNewServiceType = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for user
    const { leave } = req.body;
    let user = await GarageUser.findOne({
      _id: ObjectId(req.user.id),
    });

    if (!user) {
      console.log(" There is no user ");

      return res.status(400).json({ msg: "There is no user" });
    } else {
      user.leaves.append(leave);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error"); 
  }
};

exports.getallservicetypesbysc_id = async function (req, res) {
  try {
    const sc_id = req.query.sc_id;

    const serviceCenter = await ServiceCenter.findById({
      _id: ObjectId(sc_id),
    });

    if (!serviceCenter) {
      return res.status(400).json({ msg: "There is no service center" });
    } else {
      if (serviceCenter.servicesOffered.length == 0) {
        return res.status(400).json({
          msg: "There is no service types offer by this service center",
        });
      } else {
        return res
          .status(200)
          .json({ servicesOffered: serviceCenter.servicesOffered });
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
