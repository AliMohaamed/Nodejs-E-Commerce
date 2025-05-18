import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/error/ApiError.js";

export const isAuthorization = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (req.user.role !== role)
      return next(new ApiError(403, "You are not authorized"));
    return next();
  });
};
