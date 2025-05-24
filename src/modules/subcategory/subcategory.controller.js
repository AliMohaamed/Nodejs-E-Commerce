import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import sendResponse from "../../utils/response.js";

// Create a new subcategory
export const createSubcategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  // If name in DB
  // const existingSubcategory = await Category.findOne({
  //     name,
  //
  // });

  //   if (existingSubcategory) {
  //     return next(new ApiError(400, "Subcategory already exists"));
  //   }

  if (!req.file) {
    return next(new ApiError(400, "Subcategory image is required"));
  }

  // Check if category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

  // Upload image to cloudinary
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/subcategory` }
  );

  // Create subcategory
  const subcategory = await Subcategory.create({
    name,
    slug: slugify(name.toLowerCase()),
    image: { url: secure_url, id: public_id },
    category: categoryId,
    createdBy: req.user._id,
  });

  // Send response
  return sendResponse(res, {
    statusCode: 201,
    message: "Subcategory created successfully",
    data: subcategory,
  });
});
