import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [
    {
      id: false,
      type: String,
      enum: ["READ", "WRITE", "DELETE"],
      default: "READ",
    },
  ],
  },
  { timestamps: true }
);

;
const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;