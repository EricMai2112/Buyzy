import mongoose from "mongoose";

const inboxSchema = new mongoose.Schema({
  message: String,
  date: Date,
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar_url: String,
    favorites: [String],
    cart: [Object],
    inbox: [inboxSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
