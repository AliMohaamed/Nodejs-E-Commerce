import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/error/ApiError.js";

// One Role
export const isAuthorization = (role) => {
  return asyncHandler(async (req, res, next) => {
    if (req.user.role !== role)
      return next(new ApiError(403, "You are not authorized"));
    return next();
  });
};

// Multiple Roles (For Learning Purposes)
export const authorizeRoles = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    // Add safety checks
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }

    if (!req.user.roles || !Array.isArray(req.user.roles)) {
      return next(new ApiError(400, "User roles are not defined or invalid"));
    }
    
    // Populate roles to get role names
      await req.user.populate('roles', 'name');

    const userRoles = req.user.roles.map((r) => r.name);
    const hasAccess = roles.some((role) => userRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  });
};
