// orderRoute.ts
import express from "express";
import { getOrders, createOrder } from "../controllers/orderController"; // ⬅️ IMPORT createOrder

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder); // POST: Tạo đơn hàng mới

export default router;
