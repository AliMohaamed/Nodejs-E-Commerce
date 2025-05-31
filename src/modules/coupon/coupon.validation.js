import Joi from "joi";

export const createCouponSchema = Joi.object({
  discount: Joi.number().min(1).max(100).required(),
  expireAt: Joi.date().iso().greater("now").required(), // Make front send date ISO like "2025-06-03"
}).required();

export const updateCouponSchema = Joi.object({
  discount: Joi.number().min(1).max(100),
  expireAt: Joi.date().iso().greater("now"),
  code: Joi.string().length(5).required(),
}).required();
export const deleteCouponSchema = Joi.object({
  code: Joi.string().length(5).required(),
}).required();
