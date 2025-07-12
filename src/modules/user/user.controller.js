import Role from "../../../DB/models/role.models.js";
import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";

// PUT /users/:id/roles
export const assignRoleToUser = asyncHandler(async (req, res, next) => {
  const { roles } = req.body;

  const roleDocs = await Role.find({ name: { $in: roles } });

  if (!roleDocs.length) return next(new ApiError(404, "Roles not found"));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { roles: { $each: roleDocs.map((role) => role._id) } } },
    { new: true }
  )
    .select("name email roles")
    .populate("roles", "name")
    .lean();
  if (!user) return next(new ApiError(404, "User not found"));

  return res.status(201).json({
    message: "Roles assigned successfully",
    user,
  });
});

// DELETE /users/:id/roles
export const removeRoleFromUser = asyncHandler(async (req, res, next) => {
  const { roles } = req.body;

  const roleDocs = await Role.find({ name: { $in: roles } });

  if (!roleDocs.length) return next(new ApiError(404, "Roles not found"));

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $pull: { roles: { $in: roleDocs.map((role) => role._id) } } },
    { new: true }
  )
    .select("name email roles")
    .populate("roles", "name")
    .lean();

  if (!user) return next(new ApiError(404, "User not found"));

  return res.status(200).json({
    message: "Roles removed successfully",
    user,
  });
});

// GET /user
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("name email roles isConfirmed")
    .populate("roles", "name")
    .lean();

  return res.status(200).json({ users });
});

// GET /users/:id
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("name email roles isConfirmed")
    .populate("roles", "name")
    .lean();
  if (!user) return next(new ApiError(404, "User not found"));
  return res.status(200).json({ user });
});
