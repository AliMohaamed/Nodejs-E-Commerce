import slugify from "slugify";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import sendResponse from "../../utils/response.js";
import { Brand } from "../../../DB/models/brand.model.js";

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
    brand: req.body.brand,
  });

  // Send response
  return sendResponse(res, {
    statusCode: 201,
    message: "Subcategory created successfully",
    data: subcategory,
  });
});

// Update a subcategory
export const updateSubcategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  // Check if category exists
  const existingCategory = await Category.findById(req.params.categoryId);
  if (!existingCategory) {
    return next(new ApiError(404, "Category not found"));
  }

  // Check if subcategory exists
  const subcategory = await Subcategory.findOne({
    _id: req.params.subcategoryId,
    category: req.params.categoryId, // Ensure subcategory belongs to the category
  });
  if (!subcategory) {
    return next(new ApiError(404, "Subcategory not found"));
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

  // Check Owner
  if (subcategory.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "You are not authorized to update this subcategory")
    );
  }

  subcategory.name = name ? name : subcategory.name;
  subcategory.slug = name ? slugify(name.toLowerCase()) : subcategory.slug;

  // If image is provided
  if (req.file) {
    // Override image
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      public_id: subcategory.image.id,
    });
    subcategory.image.url = secure_url;
  }

  // Save updated subcategory
  await subcategory.save();

  // Send response
  return sendResponse(res, {
    statusCode: 200,
    message: "Subcategory updated successfully",
    data: subcategory,
  });
});

// Delete a subcategory
export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subcategoryId } = req.params;

  // Optional: Check if category exists
  const categoryExists = await Category.exists({ _id: categoryId });
  if (!categoryExists) {
    return next(new ApiError(404, "Category not found"));
  }

  // Fetch subcategory
  const subcategory = await Subcategory.findOne({
    _id: subcategoryId,
    category: categoryId,
  });

  if (!subcategory) {
    return next(new ApiError(404, "Subcategory not found"));
  }

  // Check owner
  if (subcategory.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "You are not authorized to delete this subcategory")
    );
  }

  // Delete image from cloudinary
  await cloudinary.uploader.destroy(subcategory.image.id);

  // Delete subcategory
  await Subcategory.findByIdAndDelete(subcategoryId);

  // Response
  return sendResponse(res, {
    statusCode: 200,
    message: "Subcategory deleted successfully",
  });
});

// Unified controller for both routes
export const getSubcategories = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  let subcategories;

  // If categoryId is provided, get subcategories for that category
  if (categoryId) {
    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new ApiError(404, "Category not found"));
    }

    subcategories = await Subcategory.find({ category: categoryId });
    if (subcategories.length === 0) {
      return next(
        new ApiError(404, "No subcategories found for this category")
      );
    }

    return sendResponse(res, {
      statusCode: 200,
      message:
        "Subcategories for the specified category retrieved successfully",
      data: subcategories,
    });
  }

  // No categoryId → get all
  subcategories = await Subcategory.find()
    .populate("category")
    .populate("createdBy");
  if (subcategories.length === 0) {
    return next(new ApiError(404, "No subcategories found"));
  }

  return res.status(200).json({
    success: true,
    message: "All subcategories retrieved successfully",
    length: subcategories.length,
    data: subcategories,
  });
});
