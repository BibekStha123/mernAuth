var express = require("express");
var router = express.Router();
var protectUser = require("../middleware/authMiddleware");
var {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} = require("../controller/userController");

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protectUser, getUserProfile)
  .put(protectUser, updateUserProfile);

module.exports = router;
