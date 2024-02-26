// bring user,vehicle models
const config = require("config");
var ObjectId = require("mongodb").ObjectID;
const { validationResult } = require("express-validator");
const UserRole = require("../../models/UserRoles");

exports.loadAllUserRoles = async (req, res) => {
  try {
    await UserRole.find(function (err, result) {
      if (err) return next(err);
      res.status(200).json(result);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.registerUserRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userRoleName } = req.body;

    let userRole = await UserRole.findOne({
      userRoleName: userRoleName,
    });

    if (userRole) {
      res
        .status(400)
        .json({ errors: [{ msg: "User Role alrady registered" }] });
    } else {
      //Add new user role

      userRole = new UserRole({
        userRoleName,
      });

      await userRole.save();

      res.json({ status: "User role saved successfully" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
