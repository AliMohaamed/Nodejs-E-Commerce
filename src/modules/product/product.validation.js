import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().positive().required(),
  availableItems: Joi.number().integer().positive().min(1).required(),
  brand: Joi.string().custom(isValidObjectId).optional(),
  category: Joi.string().custom(isValidObjectId).optional(),
  subcategory: Joi.string().custom(isValidObjectId).optional(),
}).required();

export const deleteProductSchema = Joi.object({
  productId:Joi.string().custom(isValidObjectId).required()
}).required()