// bring user,vehicle models
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const Vehicle = require("../../models/Vehicle");
const User = require("../../models/User");
const firebase = require("../../config/firebase");
const vehicleFunctions = require("./functions/vehicle");
const bcrypt = require("bcryptjs");
const axios = require("axios");

// register vehicle
exports.registerVehicle = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    let vehicle = await Vehicle.findOne({
      vehicleId: req.body.vehicleId,
    }).populate("user");

    if (vehicle) {
      res.status(400).json({
        msg: `Vehicle alrady registered`,
        currentUser: ` ${vehicle.user.firstName} ${vehicle.user.lastName}`,
        currentUserContact: vehicle.user.mobile,
      });
    } else {
      let img_url = "https://i.ibb.co/PwHHVwC/benzc200amg.png"; //default image

      const {
        vehicleId,
        province,
        make,
        make_name,
        model,
        model_name,
        fuel_type,
        year,
        odometer,
      } = req.body;

      if (req.file) {
        console.log("file is available");
        //upload image to firebase storage and get public URL

        let upload_res;
        try {
          upload_res = await imageUploader(req.file, vehicleId);
        } catch (error) {
          console.log(error);
        }

        if (!upload_res || upload_res === "UPLOAD_ERR") {
          console.log("Error uploading to firebase");
        } else {
          img_url = upload_res;
        }
      }

      // Build Vehicle Object
      const vehicleFields = {};
      vehicleFields.user = req.user.id;
      vehicleFields.vehicleId = vehicleId;
      vehicleFields.province = province;
      vehicleFields.make = make;
      vehicleFields.make_name = make_name;
      vehicleFields.model = model;
      vehicleFields.model_name = model_name;
      vehicleFields.fuel_type = fuel_type;
      vehicleFields.year = year;
      vehicleFields.img_url = img_url;
      vehicleFields.odometer = odometer;

      //Add new vehicle
      vehicle = new Vehicle(vehicleFields);

      await vehicle.save();

      //Get user id from auth-token
      const userId = req.user.id;
      console.log("User : " + userId);

      //Update user : Add vehicle id to vehicle array
      User.updateOne(
        { _id: new ObjectId(userId) },
        { $push: { vehicles: vehicleId } },

        function (err, res) {
          if (err) throw err;
          console.log("User successfully updated");
        }
      );

      return res.status(200).json({ msg: "Vehicle registered Successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// get current user profile
exports.getCurrentUserVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.find({ user: req.user.id });

    if (!vehicle) {
      return res.status(400).json({ msg: "There is no Vehile for this user" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in vehicle get");
  }
};

exports.transferOwnership = async (req, res) => {
  const { vehicleId, ownerId } = req.body;

  //find the vehicle is exists ***********
  const vehicle = await Vehicle.findOne({ _id: vehicleId }).select(
    "-allow -serviceRecords"
  );

  if (!vehicle) {
    return res.status(422).send({ message: "Vehicle Not Found" });
  }
  // find the user is registered
  const user = await User.findById(ownerId);
  const oldUser = await User.findById(vehicle.user);

  if (!user) {
    return res.status(422).send({ message: "user not registered" });
  }
  let userVehicles = user.vehicles;

  userVehicles.push(ownerId);

  // transfer ownership
  Vehicle.findByIdAndUpdate(vehicleId, { user: ownerId }, { new: true })
    .then(async (data) => {
      User.findByIdAndUpdate(
        vehicle.user,
        { vehicles: oldUser.vehicles.filter((x) => x != vehicle.vehicleId) },
        { new: true }
      )
        .then((x) => {
          User.findByIdAndUpdate(
            ownerId,
            { vehicles: userVehicles },
            { new: true }
          )
            .then((x) => {
              return res
                .status(200)
                .send({ message: "transfer success", data: data });
            })
            .catch((e) =>
              res.status(500).send({ error: "internal server error" })
            );
        })
        .catch((x) =>
          res.status(500).send({ message: "internal server error" })
        );
    })
    .catch((e) => {
      return res
        .status(500)
        .send({ message: "internal server error", error: e.message });
    });
};

exports.getVehicleByRegNo = async (req, res) => {
  try {
    const regNo = req.query.regNo;

    const vehicle = await Vehicle.findOne({ vehicleId: regNo }).select(
      "-allow -serviceRecords"
    );

    if (!vehicle) {
      return res
        .status(400)
        .json({ msg: "There is no Vehile for this Number" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error in vehicle get");
  }
};

// update a vehicle
exports.updateVehicle = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const { vehicleId, province, odometer } = req.body;
    let vehicle = await Vehicle.findOne({ vehicleId: req.body.vehicleId });

    if (!vehicle) {
      console.log(" There is no vehicle : " + req.body.vehicleId);

      return res.status(400).json({ msg: "There is no vehicle" });
    } else {
      if (vehicle.user == req.user.id) {
        if (province) vehicle.province = province;
        if (odometer) {
          if (vehicle.odometer <= odometer) vehicle.odometer = odometer;
          else {
            return res.status(400).json({
              msg: "Odometer shoud greater than or equal to the previous value",
            });
          }
        }

        await vehicle.save();

        res.json(vehicle);
      }
      //update vehcle details

      return res.status(400).json({ msg: "not current user's vehicle" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//give permisson to garage for access service records
exports.addpermission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const { sc_id, serviceCenterName } = req.body;
    let vehicle = await Vehicle.findOne({ _id: ObjectId(req.body.vehicleId) });

    if (!vehicle) {
      return res.status(400).json({ msg: "There is no vehicle" });
    } else {
      if (vehicle.user == req.user.id) {
        console.log("adding permission");
        const serviceCenter = await Vehicle.findOne({
          $and: [
            { _id: ObjectId(req.body.vehicleId) },
            {
              allow: { serviceCenterId: sc_id },
            },
          ],
        });

        if (serviceCenter) {
          console.log("sc enter ", serviceCenter);
          console.log("service center alrady added ");

          return res.status(400).json({
            msg: `service center ${servicecenterName} has  been added to your vehicle allow list`,
          });
        } else {
          console.log("service center has not been added");

          if (
            vehicleFunctions.addPermission(
              req.body.vehicleId,
              sc_id,
              serviceCenterName
            )
          ) {
            return res.status(200).json({
              msg: `service center ${serviceCenterName} has been successfully added to your vehicle allow list`,
              serviceCenterName: serviceCenterName,
            });
          } else {
            return res.status(500).json({
              msg: "error in adding service center to allow list",
            });
          }
        }
      }

      return res.status(400).json({
        msg: "not current user's vehicle you are not authorized to give permission to this vehicle we are tracking onyour ip address",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//remove permisson from garage for access service records
exports.removepermission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //search for already registered vehicles in db
    const { sc_id, serviceCenterName } = req.body;
    let vehicle = await Vehicle.findOne({ _id: ObjectId(req.body.vehicleId) });

    console.log("sc id", sc_id);
    if (!vehicle) {
      return res.status(400).json({ msg: "There is no vehicle" });
    } else {
      if (vehicle.user == req.user.id) {
        if (vehicleFunctions.removePermission(req.body.vehicleId, sc_id)) {
          return res.status(200).json({
            msg: `service center ${serviceCenterName} has been successfully removed from your vehicle allow list`,
            serviceCenterName: serviceCenterName,
          });
        } else {
          return res.status(400).json({
            msg: "error in removing service center from allow list",
          });
        }
      }

      return res.status(400).json({
        msg: "not current user's vehicle you are not authorized to give permission to this vehicle we are tracking onyour ip address",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//image upload to firebase => args: image and vehicle_reg as filename
async function imageUploader(vehicle_image, reg_num) {
  if (!vehicle_image) {
    return "Error: No files found";
  } else {
    console.log("file is available");
    const promise = new Promise((resolve, reject) => {
      const image = firebase.bucket.file(`vehicles/${reg_num}`);
      const uploader = image.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: vehicle_image.mimetype,
        },
      });
      uploader.on("error", (err) => {
        console.log("firebase upload error: ", err);
        resolve("UPLOAD_ERR");
      });
      uploader.on("finish", () => {
        console.log("image", image);
        // const url = image.publicUrl(); //get public url of uploaded image

        const url = `https://storage.googleapis.com/garage-lanka.appspot.com/vehicles/${reg_num}`;
        resolve(url);
      });
      uploader.end(vehicle_image.buffer);
    });
    return promise;
  }
}

// Transfer ownership

exports.removeVehicleFromUser = async (req, res) => {
  const vehicleNum = req.params.id;
  const userId = req.user.id;

  if (!vehicleNum) return res.status(400).send("Vehicle Num is Required");

  // remove user from the vehicle
  const vehicle = await Vehicle.findOne({ vehicleId: vehicleNum });
  if (!vehicle) return res.status(400).send("Invalid Vehicle Number");

  vehicle.user = null;
  await vehicle.save();

  // remove vehicle from the user
  const user = await User.findById(userId);
  const removedVehicles = user.vehicles.filter((v) => v !== vehicleNum);
  user.vehicles = removedVehicles;
  await user.save();

  res.send("Vehicle Successfully Removed");
};

exports.checkPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { password } = req.body;
    const mobile = req.user.mobile;
    const userId = req.user.id;

    try {
      console.log("request body", req.body);

      // see if user exixts
      let user = await User.findById(userId);

      if (!user) {
        console.log("There is no user");
        res
          .status(400)
          .json({ errors: [{ msg: "There is no user register again" }] });
      } else {
        // check for the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log("Password is not correct");
          res
            .status(400)
            .json({ errors: [{ msg: "password is not correct" }] });
        } else {
          // Return

          // send the otp to the user

          console.log("user mobile", req.user.mobile);

          // call the send otp route
          try {
            const res = await axios.post(
              "https://seahorse-app-wlbkp.ondigitalocean.app/api/otp",
              {
                mobile: req.user.mobile,
              }
            );

            console.log("response", res.data);
          } catch (error) {
            console.log("error", error.message);
          }

          res.status(200).send("password is matched and otp sent");
        }
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// OTP verification for transfer ownership

// exports.verifyotp = async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   var { code } = req.body;

//   var usermobile = req.user.mobile;

//   try {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/otp/verify",
//         {
//           mobile: req.user.mobile,
//           code: code,
//         },
//         res
//       );
//       // console.log("response", res.data);
//     } catch (error) {
//       console.log("error occord");
//       console.log(error.message);
//     }
//   } catch (error) {
//     console.error(error.message);
//     // res.status(500).send("Server error");
//   }
// };

exports.transferOwnership = async (req, res) => {
  const { vehicleId, ownerId } = req.body;

  //find the vehicle is exists *****
  const vehicle = await Vehicle.findOne({ _id: vehicleId }).select(
    "-allow -serviceRecords"
  );

  if (!vehicle) {
    return res.status(404).send({ message: "Vehicle Not Found" });
  }
  // find the user is registered
  const user = await User.findById(ownerId);
  const oldUser = await User.findById(vehicle.user);

  if (!user) {
    return res.status(404).send({ message: "user not registered" });
  }
  let userVehicles = user.vehicles;

  userVehicles.push(ownerId);

  // transfer ownership
  Vehicle.findByIdAndUpdate(vehicleId, { user: ownerId }, { new: true })
    .then(async (data) => {
      User.findByIdAndUpdate(
        vehicle.user,
        { vehicles: oldUser.vehicles.filter((x) => x != vehicle.vehicleId) },
        { new: true }
      )
        .then((x) => {
          User.findByIdAndUpdate(
            ownerId,
            { vehicles: userVehicles },
            { new: true }
          )
            .then((x) => {
              return res
                .status(200)
                .send({ message: "transfer success", data: data });
            })
            .catch((e) =>
              res.status(500).send({ error: "internal server error" })
            );
        })
        .catch((x) =>
          res.status(500).send({ message: "internal server error" })
        );
    })
    .catch((e) => {
      return res
        .status(500)
        .send({ message: "internal server error", error: e.message });
    });
};

// delete vehicle

exports.deleteVehicle = async (req, res) => {
  const vehicleNum = req.params.id;
  const userId = req.user.id;

  if (!vehicleNum) return res.status(400).send("Vehicle Num is Required");

  // remove user from the vehicle
  const vehicle = await Vehicle.findOne({ vehicleId: vehicleNum });
  if (!vehicle) return res.status(400).send("Invalid Vehicle Number");

  vehicle.user = null;
  await vehicle.save();

  // remove vehicle from the user
  const user = await User.findById(userId);
  const removedVehicles = user.vehicles.filter((v) => v !== vehicleNum);
  user.vehicles = removedVehicles;
  await user.save();

  res.send("Vehicle Successfully Removed");
};
