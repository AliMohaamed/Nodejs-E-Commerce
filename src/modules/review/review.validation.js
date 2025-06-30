import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const addReviewVlidation = Joi.object({
  comment: Joi.string().required().min(1).max(500).messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
    "string.max": "Content must not exceed 500 characters",
  }),
  productId: Joi.string().custom(isValidObjectId).messages({
    "any.required": "productId is required.",
  }),
  rating: Joi.number().optional().min(1).max(5).messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must not exceed 5",
  }),
});
