import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const assignRoleToUserValidation = Joi.object({
  id: Joi.string().custom(isValidObjectId).messages({
    "string.custom": "Invalid user ID format",
  }),
  roles: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": `Role should be a type of 'text'`,
      })
    )
    .min(1)
    .unique()
    .required()
    .messages({
      "array.base": `"roles" should be an array`,
      "array.min": `"roles" must contain at least 1 role`,
      "array.unique": `"roles" must contain unique values`,
      "any.required": `"roles" is a required field`,
    }),
});

export const getUserByIdValidation = Joi.object({
  id: Joi.string().custom(isValidObjectId).messages({
    "string.custom": "Invalid user ID format",
  }),
});