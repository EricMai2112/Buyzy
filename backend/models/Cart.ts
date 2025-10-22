// Cart.ts
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  image_url: String,
  color: String,
  size: String,
});

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [itemSchema],
    subtotal: Number,
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
