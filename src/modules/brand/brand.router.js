import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import { brandIdSchema,  createBrandSchema } from "./brand.validation.js";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  allBrands,
  getBrandById,
} from "./brand.controller.js";


const router = Router();


// Create
router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(createBrandSchema),
  createBrand
);
// Update and delete
router
  .route("/:brandId")
  .all(isAuthentication,  isValid(brandIdSchema))
  .put(isAuthorization("admin"),fileUpload(filterObject.image).single("brand"), updateBrand)
  .delete(isAuthorization("admin"),deleteBrand)
  .get(getBrandById)
// Get All
router.get("/", allBrands);

export default router;
