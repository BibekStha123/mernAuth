const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protectUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.json_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401).json({
        message: "Invalid token. Unauthorized access.",
      });
    }
  } else {
    res.status(401).json({ message: "Uauthorized access. No token found" });
  }
});

module.exports = protectUser;
