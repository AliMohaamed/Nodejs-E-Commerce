import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { authorizeRoles } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { assignRoleToUserValidation, getUserByIdValidation } from "./user.validation.js";
import {
  assignRoleToUser,
  getAllUsers,
  getUserById,
  removeRoleFromUser,
} from "./user.controller.js";

const router = Router();

router
  .route("/:id/roles")
  .put(
    isValid(assignRoleToUserValidation),
    isAuthentication,
    authorizeRoles("admin"),
    assignRoleToUser
  )
  .delete(
    isValid(assignRoleToUserValidation),
    isAuthentication,
    authorizeRoles("admin"),
    removeRoleFromUser
  );

router.route("/").get(isAuthentication, authorizeRoles("admin"), getAllUsers);

router
  .route("/:id")
  .get(isValid(getUserByIdValidation), isAuthentication, authorizeRoles("admin"), getUserById);

export default router;
