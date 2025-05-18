import mongoose, { model, Schema } from "mongoose";

// Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: String,
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires: Date,
    activationCode: String,
    profileImage: {
      secure_url: {
        type: String,
        default:
          "https://res.cloudinary.com/dlqnb0j16/image/upload/v1746994395/user_pwsozt.png",
      },
      public_id: {
        type: String,
        default: "user_pwsozt",
      },
    },
    coverImage: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Model
export const User = mongoose.models.User || model("User", userSchema);
