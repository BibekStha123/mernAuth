var asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

//user login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({ email });
  const comparePassword = await bcrypt.compare(password, user[0].password);

  if (user && comparePassword) {
    var userId = JSON.stringify(user[0]._id);
    generateToken(res, JSON.parse(userId));
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        _id: user[0]._id,
        name: user[0].name,
        email: user[0].email,
      },
    });
  } else {
    res.status(401).json({
      message: "Invalid email or password",
    });
  }
});

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.find({ email });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (user.length != 0) {
    res.status(400).json({
      message: "User already exist",
    });
  } else {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(200).json({
        message: "User Created Successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  }
});

//user logout
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out successfully",
  });
});

// returns user details
const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

//update user details
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email } = req.body;
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } else {
    res.status(401).json({
      message: "User not found",
    });
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
