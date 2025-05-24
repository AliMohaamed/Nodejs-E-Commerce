import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if name in DB
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new ApiError(400, "Category already exists"));
  }

  // Check file upload
  if (!req.file) return next(new ApiError(400, "Category image is required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUD_NAME}/category`,
    }
  );

  // Save category to DB
  const category = await Category.create({
    name: name,
    slug: slugify(name.toLowerCase()),
    image: { url: secure_url, id: public_id },
    createdBy: req.user._id,
  });

  // Send response
  return sendResponse(res, {
    statusCode: 201,
    message: "Created Category Successfully",
    data: category,
  });
});

// Update a category
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, createdBy } = req.body;

  // 1. Check if category exists
  const category = await Category.findById(id);
  if (!category) return next(new ApiError(404, "Category not found"));

  // 2. Prepare updated fields
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }

  if (createdBy) {
    category.createdBy = createdBy;
  }

  // 3. Update image if file uploaded
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image?.id || undefined, // fallback if image.id doesn't exist
      }
    );
    category.image = {
      id: public_id,
      url: secure_url,
    };
  }

  // 4. Save and respond
  await category.save();

  return sendResponse(res, {
    message: "Category updated successfully",
    data: category,
  });
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return next(new ApiError(404, "Invalid category id!"));
  // Delete Cloudinary
  await cloudinary.uploader.destroy(category.image.id);
  return sendResponse(res, {
    message: "Category deleted successfully",
  });
});

// Get all categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) return next(new ApiError(404, "No categories found"));

  return res.status(200).json({ success: true, data: categories });
});
