import slugify from "slugify";
import { Category } from "../../../DB/models/category.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { Brand } from "../../../DB/models/brand.model.js";

// Create a new category
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if name in DB
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return next(new ApiError(400, "Category already exists"));
  }

  // Check brand if exists
  await Promise.all(
    req.body.brand.map(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        return next(new ApiError(404, `Brand with id ${brandId} not found`));
      }
      return brand;
    })
  );

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
    brand: Array.isArray(req.body.brand) ? req.body.brand : [],
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
  const { categoryId } = req.params;
  const { name, createdBy } = req.body;

  // 1. Check if category exists
  const category = await Category.findById(categoryId);
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
  const category = await Category.findById(req.params.categoryId);
  if (!category) return next(new ApiError(404, "Invalid category id!"));

  // Check owner
  if (category.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "You are not authorized to delete this category")
    );
  }

  // Get all subcategories for this category
  const subcategories = await Subcategory.find({ category: category._id });

  // Delete all subcategories' images from Cloudinary
  // for (const subcategory of subcategories) {
  //   if (subcategory.image?.id) {
  //     await cloudinary.uploader.destroy(subcategory.image.id);
  //   }
  // }

  await Promise.all(
    subcategories.map(async (subcategory) => {
      if (subcategory.image?.id) {
        await cloudinary.uploader.destroy(subcategory.image.id);
      }
    })
  );

  // Delete all subcategories from DB
  await Subcategory.deleteMany({ category: category._id });

  // Delete category image from Cloudinary
  if (category.image?.id) {
    await cloudinary.uploader.destroy(category.image.id);
  }

  // Delete the category itself
  await Category.deleteOne({ _id: req.params.categoryId });

  return sendResponse(res, {
    message: "Category and all related subcategories deleted successfully",
  });
});

// Get all categories
export const allCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate({
    path: "subcategory",
    select: "name slug image",
    populate: [{ path: "createdBy", select: "name -_id" }],
  });
  if (!categories) return next(new ApiError(404, "No categories found"));

  return res.status(200).json({ success: true, data: categories });
});
