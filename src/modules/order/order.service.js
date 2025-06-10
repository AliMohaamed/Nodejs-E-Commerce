import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const updateStock = async (products, placeOrder) => {
  const updates = products.map((product) => {
    const quantityChange = placeOrder ? -product.quantity : product.quantity;
    const soldChange = placeOrder ? product.quantity : -product.quantity;
    return Product.findByIdAndUpdate(product.productId, {
      $inc: {
        availableItems: quantityChange,
        soldItems: soldChange,
      },
    });
  });
  await Promise.all(updates);
};
export const clearStock = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { products: [] });
};
