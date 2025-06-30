import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { cancelOrderSchema, createOrderSchema } from "./order.validation.js";
import { cancelOrder, createOrder, orderWebhook } from "./order.controller.js";
import bodyParser from "body-parser";

const router = Router();

// webhook for payment (no authentication needed, raw body parsing)
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  orderWebhook
);

// Apply authentication to all other routes
router.use(isAuthentication);

// create order
router.post("/", isValid(createOrderSchema), createOrder);
router.patch("/:orderId", isValid(cancelOrderSchema), cancelOrder);

export default router;
