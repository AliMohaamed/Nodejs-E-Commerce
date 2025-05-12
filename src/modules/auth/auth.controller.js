import { User } from "../../../DB/models/user.model.js";
import { api } from "../../constants.js";
import ApiError from "../../utils/error/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../../utils/sendMail.js";
import { signUpTemp } from "../../utils/generateHTML.js";

// REGISTER
export const register = asyncHandler(async (req, res, next) => {
  // data from request
  const { name, email, password } = req.body;
  // Check user existence
  const isUser = await User.findOne({ email });
  if (isUser) return next(new ApiError(409, "Email already registered"));
  // hash password
  const hashPassword = bcryptjs.hashSync(password, Number(process.env.SALT));
  // generate activation code
  const activationCode = crypto.randomBytes(64).toString("hex");
  // Create USER
  const user = await User.create({
    name,
    email,
    password: hashPassword,
    activationCode,
  });
  // create confirmation Link
  const link = `${api}/auth/confirmEmail/${activationCode}`;
  // send mail
  const isSent = await sendEmail({
    to: user.email,
    subject: "Activate Account",
    html: signUpTemp(link),
  });
  console.log(isSent);
  // Send Response
  return isSent
    ? res.json({ success: true, message: user })
    : next(new ApiError(400, "Something Wrong"));
});

// CONFIRM Email
export const confirmEmail = asyncHandler(async (req, res, next) => {
  // find user , delete activationCode , update isConfirmed
  const { activationCode } = req.params;
  const user = await User.findOneAndUpdate(
    { activationCode },
    { isConfirmed: true, $unset: { activationCode: 1 } },
    { new: true }
  );
  if (!user) return next(new ApiError(404, "User not found"));
  //create cart
  // can add link from frontend
  return res
    .status(200)
    .json({ success: true, message: "Email confirmed successfully!" });
});
