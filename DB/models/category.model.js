import mongoose, { Schema, Types, model } from "mongoose";

// Schema
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      url: { type: String, required: true },
      id: { type: String, required: true },
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true, // Include virtuals in the JSON output
    },
    toObject: {
      virtuals: true, // Include virtuals in the Object output
    },
  }
);

// Virtual population for subcategories
categorySchema.virtual("subcategory", {
  ref: "Subcategory",
  localField: "_id", //
  foreignField: "category", // This is the field in the Subcategory model that references the Category
});

// model
export const Category =
  mongoose.models.Category || model("Category", categorySchema);
