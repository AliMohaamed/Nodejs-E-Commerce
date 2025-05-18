import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new ApiError(400, "Category image is required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUD_NAME}/category`,
    }
  );
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    image: { url: secure_url, id: public_id },
    createdBy: req.user._id,
  });
  return sendResponse(res, {
    statusCode: 201,
    message: "Created Category Successfully",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {});

export const deleteCategory = asyncHandler(async (req, res, next) => {});
