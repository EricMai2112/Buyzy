import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  price: Number,
  image_url: String,
  rating: Number,
  review_count: Number,
});

export const Product = mongoose.model("Product", productSchema);
