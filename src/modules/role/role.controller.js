import Role from "../../../DB/models/role.models.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";

export const createRole = asyncHandler(async (req, res, next) => {
  const { name, permissions } = req.body;

  const existing = await Role.findOne({ name });

  if (existing) {
    return next(new ApiError(400, "Role already exists"));
  }

  const roleData = { name };

  // If permissions are provided, add them to the role data
  if (permissions && Array.isArray(permissions)) {
    roleData.permissions = permissions;
  }

  const role = await Role.create(roleData);

  return res.status(201).json({ role });
});

export const getAllRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().select("-__v");

  return res.status(200).json({ roles });
});

export const updateRolePermissions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { permissions } = req.body;

  // Validate permissions values
  const validPermissions = ["READ", "WRITE", "DELETE"];
  const invalidPermissions = permissions.filter(
    (perm) => !validPermissions.includes(perm)
  );

  if (invalidPermissions.length > 0) {
    return next(
      new ApiError(400, `Invalid permissions: ${invalidPermissions.join(", ")}`)
    );
  }

  const role = await Role.findById(id);

  if (!role) {
    return next(new ApiError(404, "Role not found"));
  }

  role.permissions = permissions;
  await role.save();

  return res.status(200).json({
    message: "Role permissions updated successfully",
    role,
  });
});
