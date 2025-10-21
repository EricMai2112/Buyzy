import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    rating: Number,
    comment: String,
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);
