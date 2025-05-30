import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createProductSchema,
  deleteProductSchema,
} from "./product.validation.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  allProduct,
  createProduct,
  deleteProduct,
} from "./product.controller.js";

const router = Router();

router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  fileUpload(filterObject.image).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  createProduct
);
router.get("/", allProduct);
router
  .route("/:productId")
  .all(isAuthentication, isAuthorization("admin"))
  .delete(isValid(deleteProductSchema), deleteProduct);
export default router;
