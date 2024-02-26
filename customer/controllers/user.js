const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const moment = require("moment");
var ObjectId = require("mongodb").ObjectID;
const firebase = require("../../config/firebase");

// bring user model
const User = require("../../models/User");

const Vehicle = require("../../models/Vehicle");

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { mobile, password } = req.body;
    const newuser = req.body;

    console.log(req.body);

    try {
      // see if user exixts
      let user = await User.findOne({ mobile: mobile });

      if (user && user.status == "ACTIVATED") {
        console.log("user alrady exsist");
        res.status(400).json({
          errors: [
            { msg: "User alrady exsist mobile or NIC alrady registerd" },
          ],
        });
      }
      // else if(user && user.status == "DIACTIVATED")
      else {
        user = new User(newuser);

        const expiryDate = moment().utc().add(14, "d").format();
        user.paymentExpire = expiryDate;

        // Encrypth the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save the user to database
        await user.save();

        // Return jsonwebtoken

        const payload = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            userRole: user.userRole,
            profilePictureLink: user.profilePictureLink,
            paymentExpire: expiryDate,
            status: user.status,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),

          (error, token) => {
            if (error) throw err;
            res.json({ token });
          }
        );
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// Register User Mobile
exports.registerUserMobile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { mobile, password } = req.body;
    const newuser = req.body;
    console.log(req.body);
    try {
      // see if user exixts
      let user = await User.findOne({ mobile: mobile });

      if (user) {
        res.status(400).json({
          errors: [{ msg: "User alrady alrady registerd" }],
        });
      } else {
        user = new User(newuser);

        const expiryDate = moment().utc().add(14, "d").format();
        user.paymentExpire = expiryDate;
        // Encrypth the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // save the user to database
        await user.save();

        // Return jsonwebtoken

        const payload = {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            mobile: user.mobile,
            email: user.email,
            userRole: user.userRole,
            profilePictureLink: user.profilePictureLink,
            paymentExpire: expiryDate,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),

          (error, token) => {
            if (error) throw err;
            res.json({ token });
          }
        );
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
};

// Update user

// Update user only with token

exports.updateUserWithToken = async (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  try {
    console.log("update user ");
    const id = req.user.id;
    const { firstName, lastName, email, nic, mobile } = req.body;
    // console.log("req", req);

    console.log("first Name", firstName);
    let user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid User" }] });
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }

    if (nic) {
      user.nic = nic;
    }

    if (mobile) {
      user.mobile = mobile;
    }

    // profile pic upoad
    if (req.file) {
      console.log("file is available");

      //upload image to firebase storage and get public URL

      let upload_res;
      try {
        upload_res = await imageUploader(req.file, id);
      } catch (error) {
        console.log(error);
      }

      if (!upload_res || upload_res === "UPLOAD_ERR") {
        console.log("Error uploading to firebase");
      } else {
        img_url = upload_res;

        user.profilePictureLink = img_url;
      }
    }

    const updatedUser = await user.save();

    const expiryDate = updatedUser.paymentExpire;

    // Return jsonwebtoken

    const payload = {
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        mobile: updatedUser.mobile,
        email: updatedUser.email,
        profilePictureLink: updatedUser.profilePictureLink,
        userRole: updatedUser.userRole,
        paymentExpire: expiryDate,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),

      (error, token) => {
        if (error) throw err;
        res
          .status(200)
          .json({ msg: "User Updated Successfully ", token: token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

//image upload to firebase => args: image and userId as filename
async function imageUploader(profilePicture, userID) {
  if (!profilePicture) {
    return "Error: No files found";
  } else {
    console.log("file is available");
    const promise = new Promise((resolve, reject) => {
      const image = firebase.bucket.file(
        `customerProfiles/${userID}/profilrPicture`
      );
      const uploader = image.createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          contentType: profilePicture.mimetype,
        },
      });
      uploader.on("error", (err) => {
        console.log("firebase upload error: ", err);
        resolve("UPLOAD_ERR");
      });
      uploader.on("finish", () => {
        console.log("image", image);
        // const url = image.publicUrl(); //get public url of uploaded image

        const url = `https://storage.googleapis.com/garage-lanka.appspot.com/customerProfiles/${userID}/profilrPicture`;
        resolve(url);
      });
      uploader.end(profilePicture.buffer);
    });
    return promise;
  }
}

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -__v");

    if (!user) res.status(400).send("Invalid User");

    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.deactivateUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id);

    if (!user) res.status(404).send("User not found");
    else {
      // remove vehicles from the user

      const vehicles = await Vehicle.find({ user: ObjectId(req.user.id) });

      console.log(vehicles);

      user.status = "DEACTIVATED";
      const result = await user.save();

      // console.log(result);
      res.status(200).json({ msg: "User have been deactivated" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
