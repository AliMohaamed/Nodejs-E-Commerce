import Joi from "joi";
import { Types } from "mongoose";

const isValidObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid Object ID");
};

// Register
export const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "name is required.",
  }),
  createdBy: Joi.string().custom(isValidObjectId),
}).required();
