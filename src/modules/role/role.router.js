import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { authorizeRoles } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createRole,
  getAllRoles,
  updateRolePermissions,
} from "./role.controller.js";
import {
  createRoleValidation,
  updatePermissionsValidation,
  roleIdValidation,
} from "./role.validation.js";

const router = Router();

router
  .route("/")
  .post(
    isValid(createRoleValidation),
    isAuthentication,
    authorizeRoles("admin"),
    createRole
  )
  .get(isAuthentication, authorizeRoles("admin"), getAllRoles);

router
  .route("/:id/permissions")
  .patch(
    isValid(roleIdValidation),
    isValid(updatePermissionsValidation),
    isAuthentication,
    authorizeRoles("admin"),
    updateRolePermissions
  );

export default router;
