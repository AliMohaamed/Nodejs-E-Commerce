import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  categoryIdSchema,
  createCategorySchema,
} from "./category.validation.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

const router = Router();
// create category
router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  isValid(createCategorySchema),
  fileUpload(filterObject.image).single("category"),
  createCategory
);

router
  .route("/:id")
  .all(isAuthentication, isAuthorization("admin"), isValid(categoryIdSchema))
  .put(fileUpload(filterObject.image).single("category"), updateCategory)
  .delete(deleteCategory);

export default router;
