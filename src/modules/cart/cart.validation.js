import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const cartSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
  quantity: Joi.number().min(1).default(1),
});


