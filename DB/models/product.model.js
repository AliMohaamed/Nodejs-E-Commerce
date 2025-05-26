import mongoose, { model } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
      },
    ],
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      id: {
        type: String,
        required: true,
      },
    },
    availableItems: {
      type: Number,
      required: true,
      min: 1,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      //   required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discount: {
      // Percentage discount
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    soldItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    // ratings: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     rating: {
    //       type: Number,
    //       required: true,
    //       min: 1,
    //       max: 5,
    //     },
    //     comment: String,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || model("Product", productSchema);
