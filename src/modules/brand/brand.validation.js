import Joi from "joi";

import { isValidObjectId } from "../../middleware/validation.middleware.js";

// Register
export const createBrandSchema = Joi.object({
  name: Joi.string().messages({
    "any.required": "name is required.",
  }),
  createdBy: Joi.string().custom(isValidObjectId).messages({
    "any.required": "createdBy is required.",
  }),
}).required();

export const updateBrandSchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string().regex(/^[a-z0-9-]+$/),
  createdBy: Joi.string().custom(isValidObjectId),
  image: Joi.object({
    url: Joi.string().uri(),
    id: Joi.string(),
  }).optional(),
}).required();

export const brandIdSchema = Joi.object({
  brandId: Joi.string().custom(isValidObjectId).required(),
});
