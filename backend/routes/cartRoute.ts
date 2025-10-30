import express from "express";
import {
  addToCart,
  clearCart,
  getCarts,
  updateCartItem,
} from "../controllers/cartController";

const router = express.Router();

router.get("/", getCarts);
router.post("/add", addToCart);
router.put("/update/:productId", updateCartItem);
router.delete("/clear", clearCart);

export default router;
