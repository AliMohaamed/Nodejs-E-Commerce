import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/error/ApiError.js";
import sendResponse from "../../utils/response.js";

export const addCart = asyncHandler(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const [product, cart] = await Promise.all([
    Product.findById(productId),
    Cart.findOne({ user: req.user._id }),
  ]);

  if (!product) return next(new ApiError(404, "Product not found"));
  if (quantity > product.availableItems)
    return next(new ApiError(400, `Only ${product.availableItems} in stock`));

  // check if product in cart or not
  const existingProduct = cart.products.find(
    (p) => p.productId.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ productId, quantity });
  }

  await cart.save();

  return sendResponse(res, {
    message: "Cart updated successfully",
    data: cart,
  });
});

export const updateCart = asyncHandler(async (req, res, next) => {
  const { quantity, productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, "Product not found"));

  if (quantity > product.availableItems)
    return next(new ApiError(400, `Only ${product.availableItems} in stock`));

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    },
    {
      new: true,
    }
  );
  sendResponse(res, { message: "update cart successfully!", data: cart });
});
export const userCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "products.productId",
    "name description thumbnail.url price discount finalPrice"
  );
  sendResponse(res, { data: cart });
});
export const clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      products: [],
    }
  );
  sendResponse(res, { message: "Clear Cart Successfully!" });
});
export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new ApiError(404, "Product not found"));

  await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    {
      $pull: { products: { productId: productId } },
    },
    { new: true }
  );

  sendResponse(res, { message: "Product Removed From Cart Successfully!" });
});
