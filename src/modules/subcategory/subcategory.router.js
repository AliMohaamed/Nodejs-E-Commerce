import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { subcategoryCreateSchema } from "./subcategory.validation.js";
import { createSubcategory } from "./subcategory.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(subcategoryCreateSchema),
  createSubcategory 
);
export default router;
