import express from "express";
import {
  addToCart,
  clearCart,
  getCarts,
  updateCartItem,
} from "../controllers/cartController";

const router = express.Router();

router.get("/", getCarts);
router.post("/add", addToCart); // ⬅️ CẦN THÊM
router.put("/update/:productId", updateCartItem); // ⬅️ CẦN THÊM
router.delete("/clear", clearCart); // ⬅️ CẦN THÊM

export default router;
