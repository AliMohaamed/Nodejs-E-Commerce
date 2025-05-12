import Joi from "joi";

// Register
export const registerSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(20).required().messages({
    "string.alphanum": "Username must contain only alphanumeric characters.",
    "string.min": "Username must be at least 3 characters long.",
    "string.max": "Username cannot exceed 30 characters.",
    "any.required": "Username is required.",
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be 3-30 characters long and contain only letters and numbers.",
      "any.required": "Password is required.",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match.",
    "any.required": "Confirm password is required.",
  }),
}).required();

// Activate account
export const activateAccountSchema = Joi.object({
  activationCode: Joi.string().required(),
}).required();
