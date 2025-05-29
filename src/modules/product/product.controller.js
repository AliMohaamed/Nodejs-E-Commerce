import { nanoid } from "nanoid";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import { Product } from "../../../DB/models/product.model.js";

// Create Product
export const createProduct = asyncHandler(async (req, res, next) => {
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
  console.log(product.cloudFolder);
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
