import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { createCategorySchema } from "./category.validation.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";

const router = Router();
// create category
router.post(
  "/",
  isValid(createCategorySchema),
  isAuthentication,
  isAuthorization("admin")
);

export default router;
