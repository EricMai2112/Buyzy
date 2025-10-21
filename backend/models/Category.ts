// models/Category.ts (Tạo mới)
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon_url: { type: String },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
