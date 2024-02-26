// Bring user model
const FillingStation = require("../../models/FillingStation");
// const User = require("../../models/User");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");

// Filling stations

exports.updateFuelStationFirebaseId = async function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const { fireBaseId } = req.body;

    const user = await FillingStation.findById({ _id: ObjectId(userId) });

    if (!user) {
      res.status(404).json({ msg: "There is no user" });
    }

    // update firebase id

    // update user
    await user.updateOne({
      fireBaseId: fireBaseId,
    });

    res.status(200).json({ msg: "User firebase id updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getUserFuelStationFirebaseId = async function (req, res, next) {
  try {
    const userId = req.user.id;

    const user = await FillingStation.findById({ _id: ObjectId(userId) });

    if (!user) {
      res.status(404).json({ msg: "There is no user" });
    }

    if (user.fireBaseId == null) {
      res.status(404).json({ msg: "User does not have fire base id yet" });
    }
    res.status(200).json({ fireBaseId: user.fireBaseId });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Garage Users

// exports.updateCustomerFirebaseId = async function (req, res, next) {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const userId = req.user.id;
//     const { fireBaseId } = req.body;

//     const user = await User.findById({ _id: ObjectId(userId) });

//     if (!user) {
//       res.status(404).json({ msg: "There is no user" });
//     }

//     user.fireBaseId = fireBaseId;

//     await user.save;

//     res.status(200).json({ msg: "User firebase id updated successfully" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

// exports.getCustomerUserFirebaseId = async function (req, res, next) {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById({ _id: ObjectId(userId) });

//     if (!user) {
//       res.status(404).json({ msg: "There is no user" });
//     }

//     if (user.fireBaseId == null) {
//       res.status(404).json({ msg: "User does not have fire base id yet" });
//     }
//     res.status(200).json({ fireBaseId: user.fireBaseId });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };
