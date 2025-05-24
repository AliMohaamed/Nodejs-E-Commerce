import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/error/ApiError.js";
import jwt from "jsonwebtoken";

export const isAuthentication = asyncHandler(async (req, res, next) => {
  // check token
  let token = req.headers.authorization;
  if (!token || !token.startsWith(process.env.BEARERKEY))
    return next(new ApiError("400", "Valid token is required"));
  // check payload
  // token = token.split(process.env.BEARERKEY)[1];
  token = token.split(" ")[1];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  if (!decoded) return next(new ApiError(400, "Invalid Token"));
  // check token in db
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) return next(new ApiError(400, "Token expired"));
  // check user existence
  const user = await User.findOne({ id: decoded._id, email: decoded.email });
  if (!user) return next(new ApiError(400, "User is not found "));
  // pass user
  req.user = user;
  return next();
});
