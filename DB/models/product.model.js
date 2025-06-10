import mongoose, { model } from "mongoose";
import queryHelpers from "../../src/utils/helper/queryHelpers.js";

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
    cloudFolder: { type: String, unique: true },
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
  },
  {
    timestamps: true,
    strictQuery: true, // Filtration
    toJSON: {
      virtuals: true,
    },
  }
);

// virtual
productSchema.virtual("finalPrice").get(function () {
  // this >>> document >> product {}
  if (this.price) {
    return Number.parseFloat(
      this.price - (this.price * this.discount || 0) / 100
    ).toFixed(2);
  }
});

productSchema.plugin(queryHelpers);

productSchema.methods.inStock = function (requiredQuantity) {
  return this.availableItems >= requiredQuantity;
};

export const Product =
  mongoose.models.Product || model("Product", productSchema);
