const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const auth = require("../../middleware/auth");

// bring vehicle controller
const vehicleController = require("../../controllers/vehicle");

// Otp controller for send OTP
const otpController = require("../../controllers/otp");

//multer config
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

// @route   POST api/vehicles
// @desc    Register vehicles
// @access  Private
router.post(
  "/",
  auth,
  upload.single("vehicle_image"),
  [
    body("vehicleId", "VehicleId is required").not().isEmpty(),
    body("province", "province is required").not().isEmpty(),
    body("make", "make is required").not().isEmpty(),
    body("make_name", "make is required").not().isEmpty(),
    body("model", "model name is required").not().isEmpty(),
    body("model_name", "model name is required").not().isEmpty(),
    body("fuel_type", "fuel type is required").not().isEmpty(),
    body("year", "year is required").not().isEmpty(),
    body("odometer", "Odometer value (KM) is required").not().isEmpty(),
  ],
  vehicleController.registerVehicle
);

// @route   GET api/vehicles
// @desc    Register vehicles
// @access  Private

router.get("/myvehicles", auth, vehicleController.getCurrentUserVehicle);

router.get("/", auth, vehicleController.getVehicleByRegNo);

// @route   POST api/vehicles
// @desc    Update vehicle information
// @access  Private
router.post(
  "/update",
  auth,
  [
    body("vehicleId", "VehicleId is required").not().isEmpty(),
    body("province", "province is required").not().isEmpty(),
    // body("make", "make is required").not().isEmpty(),
    // body("model", "model is required").not().isEmpty(),
    // body("year", "year is required").not().isEmpty(),
    body("odometer", "Odometer value (KM) is required").not().isEmpty(),
  ],
  vehicleController.updateVehicle
);

// @route   POST api/vehicles/addAllow
// @desc    Update vehicle information
// @access  Private
router.post(
  "/addallow",
  auth,
  [
    body("vehicleId", "VehicleId is required").not().isEmpty(),
    body("sc_id", "service Center id is required").not().isEmpty(),
    body("serviceCenterName", "service Center Name is required")
      .not()
      .isEmpty(),
  ],
  vehicleController.addpermission
);

// @route   POST api/vehicles/addAllow
// @desc    Update vehicle information
// @access  Private
router.delete(
  "/removeallow",
  auth,
  [
    body("vehicleId", "VehicleId is required").not().isEmpty(),
    body("sc_id", "service Center id is required").not().isEmpty(),
    body("serviceCenterName", "service Center Name is required")
      .not()
      .isEmpty(),
  ],
  vehicleController.removepermission
);

// Transfer ownership

// @route   POST api/otp
// @desc    Send OTP
// @access  Public
router.post(
  "/sendotp",
  [
    body("mobile", "Please enter a valid Mobile Number").isLength({
      min: 10,
      max: 10,
    }),
  ],
  otpController.sendOTP
);

// router.post(
//   "/validateotp",
//   auth,
//   [
//     body("code", "Please enter a valid OTP Code").isLength({
//       min: 6,
//       max: 6,
//     }),
//   ],
//   vehicleController.verifyotp
// );
router.post(
  "/checkpassword",
  auth,
  [body("password", "password is required").not().isEmpty()],

  vehicleController.checkPassword
);
router.post("/transferownership", auth, vehicleController.transferOwnership);

router.put(
  "/:id",
  auth,
  [
    body("ownerId", "ownerId is required").not().isEmpty(),
    body("vehicleId", "VehicleId is required").not().isEmpty(),
  ],
  vehicleController.removeVehicleFromUser
);

module.exports = router;
