import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";


export const addReview = asyncHandler(async (req, res,next)=>{
  // Data
  const { comment, productId,rating } = req.body;
  // Check if product exists
const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }
  // Create review object
  const review = {
    user: req.user._id,
    // rating >> optional 
    rating: rating || null, 
    comment
  };
  // Add review to product
  product.reviews.push(review);
  // Save product
  await product.save();
  // Respond with success message
  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: product.reviews[product.reviews.length - 1], // Return the newly added review
  });
})