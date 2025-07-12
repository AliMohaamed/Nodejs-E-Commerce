import mongoose, { Schema } from "mongoose";

const logSchema = new Schema({
  menubar: { type: String, required: true },
  stack: { type: String },
  level: { type: String, enum: ["info", "warn", "error"], default: "error" },
  timestamp: { type: Date, default: Date.now },
  path: { type: String },
  method: { type: String, enum: ["GET", "POST", "PUT", "DELETE"] },
  user: { type: Schema.Types.ObjectId, ref: "User", default: null },
});

const Log = mongoose.models.Log || mongoose.model("Log", logSchema);
export default Log;
