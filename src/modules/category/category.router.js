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
  allCategories,
} from "./category.controller.js";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import productRouter from "../product/product.router.js";

const router = Router();

//  Mount subcategory routes under /category/:categoryId/subcategory
router.use("/:categoryId/subcategory", subcategoryRouter);
router.use("/:categoryId/products", productRouter);

// Create
router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(createCategorySchema),
  createCategory
);
// Update and delete
router
  .route("/:categoryId")
  .all(isAuthentication, isAuthorization("admin"), isValid(categoryIdSchema))
  .put(fileUpload(filterObject.image).single("category"), updateCategory)
  .delete(deleteCategory);

// Get All
router.get("/", allCategories);

export default router;
