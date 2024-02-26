const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body } = require("express-validator");

// bring auth controller
const authController = require("../../controllers/auth");

// @route GET api/auth
// @desc Test route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    // get back the user from the database collections without user password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token (login)
// @access  Public
router.post(
  "/",
  [
    body("mobile", "Please Enter a valid mobile number").not().isEmpty(),
    body("password", "Please Enter your password").exists(),
  ],
  authController.auth
);

// @route   POST api/auth/ownertoken
// @desc  owner and  token (login)
// @access  Private
router.post(
  "/ownertoken",
  auth,
  [
    body(
      "serviceCenterID",
      "serviceCenterID is required please select a service center"
    )
      .not()
      .isEmpty(),
  ],
  authController.realeaseTokenToOwners
);

// @route   POST api/auth/mobile
// @desc    Authenticate user and get token (login)
// @access  Public
router.post(
  "/mobile",
  [
    body("email", "Please Enter a valid email address").isEmail(),

    body("password", "Please Enter your password").exists(),
  ],
  authController.mobileauth
);

// @route   POST api/auth/forgotpasswordmobile
// @desc    user forgot password
// @access  Public
router.post(
  "/forgotpasswordmobile",
  [
    body("mobile", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  authController.forgotpasswordmobile
);
// forgot password with email

// @route   POST api/auth/forgotpassword
// @desc    user forgot password
// @access  Public
router.post(
  "/forgotpassword",
  [body("email", "Please Enter a valid email address").isEmail()],
  authController.forgotpassword
);
// @route   POST api/auth/resetpasswordmobile
// @desc    user reset password by providing random string
// @access  Public
router.post(
  "/resetpasswordmobile",
  [
    body("mobile", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
    body("code", "Please Enter a valid recovery code").isLength({
      min: 6,
      max: 6,
    }),
  ],

  authController.resetPasswordmobile
);

// @route   POST api/auth/resetpasswordreceivesms
// @desc    user reset password by providing random string
// @access  Public
router.post(
  "/resetpasswordreceivesms",
  [
    body("mobile", "Please enter a valid mobile number").isLength({
      min: 10,
      max: 10,
    }),
  ],

  authController.resetpasswordreceivesms
);

// @route   POST api/auth/resetpassword
// @desc    user reset password by providing random string
// @access  Public
router.post(
  "/resetpassword",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("code", "Please Enter a valid recovery code").isLength({
      min: 6,
      max: 6,
    }),
  ],

  authController.resetPassword
);

// @route   POST api/auth/newpassword
// @desc    user enter new passsword with specific token
// @access  Public
router.post(
  "/newpassword",
  auth,
  [
    body(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  authController.newPassword
);

// @route   POST api/auth/newpasswordmobile
// @desc    user enter new passsword with specific token
// @access  Public
router.post(
  "/newpasswordmobile",
  auth,
  [
    body(
      "password",
      "Please Enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  authController.newPasswordmobile
);

module.exports = router;
