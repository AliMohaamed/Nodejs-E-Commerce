import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import {
  addToCart,
  clearCart,
  removeProductFromCart,
  updateCart,
  userCart,
} from "./cart.controller.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { cartSchema } from "./cart.validation.js";
import { deleteProductSchema } from "../product/product.validation.js";

const router = Router();

router.use(isAuthentication);

// CRUD
router
  .route("/")
  .post(isValid(cartSchema), addToCart)
  .patch(isValid(cartSchema), updateCart)
  .get(userCart);
// clear cart
router.patch("/clear", clearCart);
// remove product from cart
router.patch(
  "/:productId",
  isValid(deleteProductSchema),
  removeProductFromCart
);

export default router;
