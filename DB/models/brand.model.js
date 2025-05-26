import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: true,
      min: 2,
      max: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      id: {
        type: String,
        required: [true, "Image ID is required"],
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
