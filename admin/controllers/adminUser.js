const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// bring user model
const User = require("../../models/AdminUser");

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, nic, email, mobile, password, userRole } =
    req.body;

  try {
    // see if user exixts
    let user = await User.findOne({ mobile: mobile });

    if (user) {
      res.status(400).json({ errors: [{ msg: "User alrady exsist" }] });
    }

    user = new User({
      firstName,
      lastName,
      email,
      nic,
      mobile,
      password,
      userRole,
    });

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
        userRole: user.userRole,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      {
        expiresIn: 36000,
      },
      (error, token) => {
        if (error) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
