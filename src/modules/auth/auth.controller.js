import { User } from "../../../DB/models/user.model.js";

import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendMail.js";
import { resetPasswordTemp, signUpTemp } from "../../utils/generateHTML.js";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import { generateExpiryDate } from "../../utils/generateExpiryDate.js";
import randomstring from "randomstring";
import { Cart } from "../../../DB/models/cart.model.js";
// Register
export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { name, email, password } = req.body;
  // Check user existence
  const isUser = await User.findOne({ email });
  if (isUser) return next(new ApiError(409, "Email already registered"));
  // generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex");
  // Create USER
  const user = await User.create({
    name,
    email,
    password,
    activationCode,
  });
  // create confirmation Link
  const link = `${process.env.API}/auth/confirmEmail/${activationCode}`;
  // send mail
  const isSent = await sendEmail({
    to: user.email,
    subject: "Activate Account",
    html: signUpTemp(link),
  });
  // Send Response
  return isSent
    ? res.json({ success: true, message: "Check Your Email" })
    : next(new ApiError(400, "Something Wrong"));
});

// Activate Mail
export const activateMail = asyncHandler(async (req, res, next) => {
  // find user , delete activationCode , update isConfirmed
  const { activationCode } = req.params;
  const user = await User.findOneAndUpdate(
    { activationCode },
    { isConfirmed: true, $unset: { activationCode: 1 } },
    { new: true }
  );
  if (!user) return next(new ApiError(404, "User not found"));
  // TODO: create cart
  await Cart.create({ user: user._id });
  return res
    .status(200)
    .json({ success: true, message: "Email confirmed successfully!" });
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  // 1- data from request
  const { email, password } = req.body;
  // 2- check user
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, "Email Or Password is invalid"));
  // 3- check isConfirmed
  if (!user.isConfirmed)
    return next(
      new ApiError(400, "Account is not activate, please check your emails")
    );
  // 4- check password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) return next(new ApiError(404, "Email Or Password is invalid"));
  // 5- create token
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
  // 6- save token in token model
  await Token.create({
    token: refreshToken,
    user: user._id,
    agent: req.headers["User-Agent"],
    expireAt: generateExpiryDate(7, "days"),
  });
  // 7- change user status to online and save user in db
  user.status = "online";
  // 8- response
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access, protects against XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevents CSRF attacks by blocking cross-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry (matches token expiry)
    })
    .json({ success: true, message: "Logged in successfully", accessToken });
});

// Refresh Token
export const refreshToken = asyncHandler(async (req, res, next) => {
  // get refresh token from cookies
  const token = req.cookies.refreshToken;
  if (!token) return next(new ApiError(400, "Refresh token is required"));
  // verify token
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);
  if (!decoded) return next(new ApiError(400, "Invalid refresh token"));
  // check token in db
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new ApiError(400, "Token expired"));
  // create new access token
  const accessToken = jwt.sign(
    { id: decoded.id, email: decoded.email },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "15m",
    }
  );
  // response with new access token
  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken,
  });
})

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ApiError(404, "Email not found"));
  // otp Generator
  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  const otpExpires = generateExpiryDate(5, "minutes");
  user.otp = otp;
  user.otpExpires = otpExpires;

  // save otp in db
  await user.save();
  // send mail to user
  return (await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: resetPasswordTemp(otp),
  }))
    ? res.status(200).json({ success: true, message: "check your email" })
    : next(new ApiError("Something went wrong"));
});

// verifyOtp
export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, "User is not found"));

  if (!user.otp || !user.otpExpires)
    return next(new ApiError(400, "OTP not found"));

  if (user.otpExpires < Date.now())
    return next(new ApiError(400, "OTP expired"));

  if (user.otp !== otp) return next(new ApiError(400, "Invalid OTP"));

  res.status(200).json({ success: true, message: "OTP verified" });
});

// resetPassword
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ApiError(404, "User is not found"));

  if (!user.otp || !user.otpExpires)
    return next(new ApiError(400, "OTP not found"));

  if (user.otpExpires < Date.now())
    return next(new ApiError(400, "OTP expired"));

  if (user.otp !== otp) return next(new ApiError(400, "Invalid OTP"));

  // hash password
  const hashPassword = bcryptjs.hashSync(password, 10);
  // save in db
  await User.updateOne(
    { _id: user.id },
    {
      password: hashPassword,
      $unset: { otp: 1, otpExpires: 1 },
    }
  );
  // invalidate tokens
  const tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  return res.status(200).json({ success: true, message: "Done, Go to login" });
});
