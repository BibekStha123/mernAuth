const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("json_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

module.exports = generateToken;
