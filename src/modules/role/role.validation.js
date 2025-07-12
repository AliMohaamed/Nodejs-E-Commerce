import Joi from "joi";

export const createRoleValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  permissions: Joi.array()
    .items(Joi.string().valid("READ", "WRITE", "DELETE"))
    .optional()
    .messages({
      "any.only": "Permissions must be one of: READ, WRITE, DELETE",
    }),
});

export const updatePermissionsValidation = Joi.object({
  permissions: Joi.array()
    .items(Joi.string().valid("READ", "WRITE", "DELETE"))
    .min(1)
    .required()
    .messages({
      "any.only": "Permissions must be one of: READ, WRITE, DELETE",
      "array.min": "At least one permission is required",
    }),
});

export const roleIdValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid role ID format",
    "string.length": "Role ID must be 24 characters long",
  }),
});
