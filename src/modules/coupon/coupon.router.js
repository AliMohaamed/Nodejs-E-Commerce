import { Router } from "express";
import { isAuthentication } from "../../middleware/authentication.middleware.js";
import { isAuthorization } from "../../middleware/authorization.middleware.js";
import {
  allCoupons,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "./coupon.controller.js";
import {
  createCouponSchema,
  deleteCouponSchema,
  updateCouponSchema,
} from "./coupon.validation.js";
import { isValid } from "../../middleware/validation.middleware.js";

const router = Router();

// create coupon
router.post(
  "/",
  isAuthentication,
  isAuthorization("admin"),
  isValid(createCouponSchema),
  createCoupon
);
router.patch(
  "/:code",
  isAuthentication,
  isAuthorization("admin"),
  isValid(updateCouponSchema),
  updateCoupon
);
router.delete(
  "/:code",
  isAuthentication,
  isAuthorization("admin"),
  isValid(deleteCouponSchema),
  deleteCoupon
);
router.get("/", allCoupons);

export default router;
