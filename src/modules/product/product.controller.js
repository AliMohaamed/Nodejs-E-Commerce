import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import { Product } from "../../../DB/models/product.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Brand } from "../../../DB/models/brand.model.js";

// Create Product
export const createProduct = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new ApiError(404, "Category not found"));

  // check subcategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory) return next(new ApiError(404, "Subcategory not found"));

  // check category
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new ApiError(404, "Brand not found"));
  // Check Files
  if (!req.files) return next(new ApiError(400, "Product Images Required"));
  // Create unique folder name
  const cloudFolder = nanoid(10);
  const images = [];
  // upload sub files
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }
  // upload thumbnail (default image)
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.thumbnail[0].path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
  );
  const product = await Product.create({
    ...req.body,
    images,
    thumbnail: {
      url: secure_url,
      id: public_id,
    },
    createdBy: req.user._id,
    cloudFolder,
  });
  return res.status(200).json({
    success: true,
    message: "Created Product Successfully!",
    data: product,
  });
});

// Delete Product
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ApiError(404, "Product not found!"));
  // Check owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new ApiError(403, "No Authorize"));
  const ids = product.images.map((image) => image.id);
  ids.push(product.thumbnail.id);
  // Delete Images
  await cloudinary.api.delete_resources(ids);
  // Delete Folder
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`
  );
  // Delete product
  await Product.findByIdAndDelete(req.params.productId);
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully!" });
});

// All Product
export const allProduct = asyncHandler(async (req, res, next) => {
  console.log(req.params.categoryId);
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new ApiError(404, "Category not found"));

    const products = await Product.find({ category: category._id })
      .paginate(req.query.page)
      .lean();
    console.log(products);
    if (!products || products.length === 0)
      return next(new ApiError(404, "no products for this category"));
    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  }

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort)
    .lean();

  if (!products || products.length === 0)
    return next(new ApiError(404, "No Products"));

  res
    .status(200)
    .json({ success: true, count: products.length, data: products });
});

// Single Product
export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ApiError(404, "Product not found"));
  res.status(200).json({ success: true, data: product });
});

// Update Product
export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new ApiError(404, "Product not found!"));
  // Check owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new ApiError(403, "No Authorize"));

  if (req.files && req.files.subImages) {
    const idsToDelete = product.images.map((img) => img.id);
    if (idsToDelete.length > 0) {
      await cloudinary.api.delete_resources(idsToDelete);
    }

    product.images = [];

    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`,
        }
      );
      product.images.push({ id: public_id, url: secure_url });
    }
  }

  if (req.files && req.files.thumbnail) {
    await cloudinary.uploader.destroy(product.thumbnail.id);

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.thumbnail[0].path,
      {
        folder: `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`,
      }
    );

    product.thumbnail = {
      id: public_id,
      url: secure_url,
    };
  }
  // Update
  await product.save();

  res.status(200).json({
    success: true,
    message: "Updated Product Successfully!",
    data: product,
  });
});
