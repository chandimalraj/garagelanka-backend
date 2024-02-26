const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { body } = require("express-validator");

// bring auth controller
const userController = require("../../controllers/userController");

router.post(
  "/finduserbymobile",
  [
    body("mobile", "Please Enter a valid mobile number").isLength({
      min: 10,
    }),
  ],
  userController.findUserByMobile
);

// @route GET api/auth
// @desc Test route
// @access Public
// router.get("/", auth, async (req, res) => {
//   try {
//     // get back the user from the database collections without user password
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

// @route   POST api/auth
// @desc    Authenticate user and get token (login)
// @access  Public
router.post(
  "/",
  [body("nic", "Please Enter nic number of the user").exists()],
  userController.finduser
);

// // forgot password with email

// // @route   POST api/auth/forgotpassword
// // @desc    user forgot password
// // @access  Public
// router.post(
//   "/forgotpassword",
//   [
//     body("email", "Please enter a valid email address").isLength({
//       min: 10,
//       max: 12,
//     }),
//   ],
//   authController.forgotpassword
// );

// // @route   POST api/auth/resetpassword
// // @desc    user reset password by providing random string
// // @access  Public
// router.post(
//   "/resetpassword",
//   [
//     body("email", "Please enter a valid email").isEmail(),
//     body("code", "Please Enter a valid recovery code").isLength({
//       min: 6,
//       max: 6,
//     }),
//   ],

//   authController.resetPassword
// );

// // @route   POST api/auth/newpassword
// // @desc    user enter new passsword with specific token
// // @access  Public
// router.post(
//   "/newpassword",
//   auth,
//   [
//     body(
//       "password",
//       "Please Enter a password with 6 or more characters"
//     ).isLength({ min: 6 }),
//   ],

//   authController.newPassword
// );

module.exports = router;
