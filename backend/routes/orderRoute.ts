// orderRoute.ts
import express from "express";
import {
  getOrders,
  createOrder,
  getOrdersByUserId,
} from "../controllers/orderController";

const router = express.Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.get("/:userId", getOrdersByUserId);

export default router;
