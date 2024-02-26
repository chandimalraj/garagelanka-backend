const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const auth = require("../../middleware/auth");
const userRoleController = require("../../controllers/userRoles");

router.post(
  "/adduserrole",
  auth,
  [body("userRoleName", "userRole name is required").not().isEmpty()],
  userRoleController.registerUserRole
);

router.get("/loadalluserroles", auth, userRoleController.loadAllUserRoles);
module.exports = router;
