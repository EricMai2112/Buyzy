// orderRoute.ts
import express from "express";
import {
  getOrders,
  createOrder,
  getOrdersByUserId,
} from "../controllers/orderController"; // ⬅️ IMPORT createOrder

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder); // POST: Tạo đơn hàng mới
router.get("/:userId", getOrdersByUserId);

export default router;
