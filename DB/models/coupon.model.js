import mongoose, { Types } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    expireAt: { type: Number, required: true },
    discount: { type: Number, required: true, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
