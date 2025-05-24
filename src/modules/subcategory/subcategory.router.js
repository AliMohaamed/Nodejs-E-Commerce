import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createSubcategorySchema,
  deleteSubcategorySchema,
  getAllSubcategoriesSchema,
  updateSubcategorySchema,
} from "./subcategory.validation.js";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategories,
  updateSubcategory,
} from "./subcategory.controller.js";

const router = Router({ mergeParams: true });

// Create a new subcategory
router
  .route("/")
  .all(isAuthentication, isAuthorization("admin"))
  .post(
    fileUpload(filterObject.image).single("subcategory"),
    isValid(createSubcategorySchema),
    createSubcategory
  );

router
  .route("/:subcategoryId")
  .all(isAuthentication, isAuthorization("admin"))
  .put(
    fileUpload(filterObject.image).single("subcategory"),
    isValid(updateSubcategorySchema),
    updateSubcategory
  )
  .delete(isValid(deleteSubcategorySchema), deleteSubcategory);

// Get All Subcategories and Get all subcategories by category ID
router.get("/", isValid(getAllSubcategoriesSchema), getSubcategories);

export default router;
