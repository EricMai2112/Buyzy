import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  qty: Number,
  image_url: String,
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
