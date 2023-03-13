const User = require("../models/UserModel");
const sendEmail = require("../utils/email");
const sendToken = require("../utils/jwt");
const crypto = require("crypto");
const { json } = require("express");

exports.registerUser = async (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  sendToken(user, 201, res);
};
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(json.status(400, "enter valid cred"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(json.status("invalid error"));
  }
  if (!(await user.isValidPassword(password))) {
    return next(json.status("invalid error"));
  }
  sendToken(user, 201, res);
};
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
    .status(200)
    .json({
      success: true,
      message: "logout",
    });
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(json.status("user not found"));
  }
  const resetToken = user.resetPassword();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `tour password result url is as follows \n\n ${resetUrl}\n\n if you have not this email ,then ignore it`;
  try {
    sendEmail({
      email: user.email,
      subject: "myCart recovery passwod",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email send to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPassordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(json.status("eroor in reseting"));
  }
};
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPassordTokenExpire: { $: Date.now() },
  });
  if (!user) {
    return next(json.status("password expires"));
  }
  if (req.body.password !== req.body.confirmpassword) {
    return next(json.status("error passes"));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPassordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
};

exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
};
exports.changePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.isValidPassword(req.body.oldPassword))) {
    return next(json.status("old incorect pass"));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json({
    success: true,
  });
};
exports.updateProfile = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
};
//admin:get
exports.getAllUsers = async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
};
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(json.status("not"));
  }
  res.status(200).json({
    success: true,
    user,
  });
};
exports.updateUser = async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
};
exports.deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      res.status(400).json({
        success: false,
        message: `error to get user ${req.params.id}`,
      })
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
};
