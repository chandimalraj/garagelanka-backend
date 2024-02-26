const express = require("express");
const router = express.Router();
const multer = require("multer");
const { body } = require("express-validator");
const auth = require("../../middleware/auth");

// bring user controller
const userController = require("../../controllers/user");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/", [
  body("firstName", "First Name in required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),

  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  body(
    "password",
    "Please Enter a password with 4 or more characters"
  ).isLength({ min: 4 }),
  userController.registerUser,
]);

//  Update User with token
// multer configaration
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false); //reject file
};

const upload = multer({
  storage: multer.memoryStorage(), //storage,
  limits: { fileSize: 1024 * 1024 * 2 }, //file size 2MB
  fileFilter: fileFilter,
});

router.put("/update", auth, upload.single("profile_image"), [
  body("firstName", "First Name in required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),
  body("nic", "National identity card Number is required").not().isEmpty(),
  body("email", "Please Enter a valid email address").isEmail(),
  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  userController.updateUserWithToken,
]);

//  Update User

// router.put("/:id", [
//   body("firstName", "First Name in required").not().isEmpty(),
//   body("lastName", "Last Name is required").not().isEmpty(),
//   body("nic", "National identity card Number is required").not().isEmpty(),
//   body("email", "Please Enter a valid email address").isEmail(),
//   body("mobile", "Please enter a valid Mobile Number").isLength({
//     min: 10,
//     max: 12,
//   }),
//   userController.updateUser,
// ]);

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post("/registermobile", [
  body("firstName", "First Name in required").not().isEmpty(),
  body("lastName", "Last Name is required").not().isEmpty(),

  body("mobile", "Please enter a valid Mobile Number").isLength({
    min: 10,
    max: 12,
  }),
  body(
    "password",
    "Please Enter a password with 4 or more characters"
  ).isLength({ min: 4 }),
  userController.registerUser,
]);

router.get("/", auth, userController.getUserProfile);

// deactivate user

router.delete("/deactivateuser", auth, userController.deactivateUser);
module.exports = router;
