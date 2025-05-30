import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";

// Create a new brand
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  // Check if name in DB
  const existingBrand = await Brand.findOne({ name });
  if (existingBrand) {
    return next(new ApiError(400, "brand already exists"));
  }

  // Check file upload
  if (!req.file) return next(new ApiError(400, "brand image is required"));
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.FOLDER_CLOUD_NAME}/brand`,
    }
  );

  // Save brand to DB
  const brand = await Brand.create({
    name: name,
    slug: slugify(name.toLowerCase()),
    image: { url: secure_url, id: public_id },
    createdBy: req.user._id,
  });
  if (!brand) return next(new ApiError(500, "Failed to create brand"));
  return sendResponse(res, {
    message: "brand created successfully",
    data: brand,
  });
});

// Update a brand
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { brandId } = req.params;
  const { name, createdBy } = req.body;

  // 1. Check if brand exists
  const brand = await Brand.findById(brandId);
  if (!brand) return next(new ApiError(404, "Brand not found"));

  // 2. Prepare updated fields
  if (name) {
    brand.name = name;
    brand.slug = slugify(name);
  }

  if (createdBy) {
    brand.createdBy = createdBy;
  }

  // 3. Update image if file uploaded
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.image?.id || undefined, // fallback if image.id doesn't exist
      }
    );
    brand.image = {
      id: public_id,
      url: secure_url,
    };
  }

  // 4. Save and respond
  await brand.save();

  return sendResponse(res, {
    message: "brand updated successfully",
    data: brand,
  });
});

// Delete a brand
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new ApiError(404, "Invalid brand id!"));

  // Check owner
  if (brand.createdBy.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(403, "You are not authorized to delete this brand")
    );
  }

  // Delete brand image from Cloudinary
  if (brand.image?.id) {
    await cloudinary.uploader.destroy(brand.image.id);
  }

  // Delete the brand itself
  await Brand.deleteOne({ _id: req.params.brandId });

  return sendResponse(res, {
    message: "Brand deleted successfully",
  });
});

// Get all brands
export const allBrands = asyncHandler(async (req, res, next) => {
  console.log("Fetching all brands...");
  const brands = await Brand.find();
  if (!brands) return next(new ApiError(404, "No categories found"));

  return res.status(200).json({ success: true, data: brands });
});

// Get a single brand by ID
export const getBrandById = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.brandId);
  if (!brand) return next(new ApiError(404, "Brand not found"));

  return res.status(200).json({ success: true, data: brand });
});
