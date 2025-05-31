import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
import ApiError from "../../utils/error/ApiError.js";
export const createCoupon = asyncHandler(async (req, res, next) => {
  const code = voucher_codes.generate({
    length: 5,
  });
  const coupon = await Coupon.create({
    name: code[0],
    discount: req.body.discount,
    createdBy: req.user._id,
    expireAt: new Date(req.body.expireAt).getTime(), // month/day/year
  });
  return res.status(201).json({
    success: true,
    message: "Created coupon successfully!",
    data: coupon,
  });
});
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expireAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new ApiError(404, "Invalid code"));

  // check owner
  if (req.user._id.toString !== coupon.createdBy.toString)
    return next(new ApiError(403, "You are not the owner!"));
  // update
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expireAt = req.body.expireAt
    ? new Date(req.body.expireAt).getTime()
    : coupon.expireAt;

  await coupon.save();
  return res.status(201).json({
    success: true,
    message: "Updated coupon successfully!",
    data: coupon,
  });
});
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
  });
  if (!coupon) return next(new ApiError(404, "Invalid code"));
  // check owner
  if (req.user._id.toString !== coupon.createdBy.toString)
    return next(new ApiError(403, "You are not the owner!"));
  await Coupon.findByIdAndDelete(coupon._id);
  return res.status(201).json({
    success: true,
    message: "Delete coupon successfully!",
  });
});
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({
    expireAt: { $gt: Date.now() },
  }).populate("createdBy", "name email role");
  return res.status(200).json({
    success: true,
    message: "All coupons",
    data: coupons,
  });
});
