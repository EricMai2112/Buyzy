import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  qty: Number,
  image_url: String,
});

const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [itemSchema],
    total: Number,
    status: String,
    shipping_address: String,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
