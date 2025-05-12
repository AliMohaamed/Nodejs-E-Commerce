import ApiError from "../utils/error/ApiError.js";

export const isValid = (schema) => {
  return (req, res, next) => {
    const copyReqObj = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(copyReqObj, {
      abortEarly: false,
    });
    if (validationResult.error) {
      const messages = validationResult.error.details.map((err) => err.message);
      return next(new ApiError(400, messages));
    }
    return next();
  };
};
