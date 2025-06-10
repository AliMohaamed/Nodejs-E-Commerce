import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const createOrderSchema = Joi.object({
  address: Joi.string().required(),
  phone: Joi.string().required(),
  coupon: Joi.string().length(5),
  payment: Joi.string().valid("cash", "visa").required(),
}).required();
export const cancelOrderSchema = Joi.object({
  orderId: Joi.string().custom(isValidObjectId).required(),
}).required();
