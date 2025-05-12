import mongoose, { Schema, Types, model } from "mongoose";
// Schema
const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    agent: {
      type: String,
    },
    expireAt: {
      type: Date,
      required: true,
      expires: 0, // TTL based on date
    },
  },
  { timestamps: true }
);
// Model
export const Token = mongoose.models.Token || model("Token", tokenSchema);
