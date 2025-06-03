import mongoose, { model, Schema } from "mongoose";

const cartSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  products: [
    {
      _id: false,
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
});

export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
