import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const subcategoryCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();
