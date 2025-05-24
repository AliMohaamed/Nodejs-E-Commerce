import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createSubcategorySchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

// Update subcategory schema
export const updateSubcategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
  name: Joi.string().min(3).max(20),
}).required();

// Delete subcategory schema
export const deleteSubcategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

// Get all subcategories by category ID
export const getAllSubcategoriesSchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId),
});
