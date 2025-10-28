// orderController.ts (FIXED: Đảm bảo trả về order.total)
import { Request, Response } from "express";
import { Order } from "../models/Order";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "../utils/getUserIdFromRequest";

// ***************************************************************
// LƯU Ý QUAN TRỌNG: MOCK_USER_ID chỉ dùng cho mục đích demo.
// ***************************************************************
const getUserId = (req: Request): mongoose.Types.ObjectId | null => {
  return getUserIdFromRequest(req); // ✅ Dùng Helper mới
};

export const getOrders = async (_: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
};
export const getOrdersByUserId = async (req: Request, res: Response) => {
  const userId = getUserId(req); // Lấy ID từ params

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing." });
  }

  try {
    const orders = await Order.find({ user_id: userId }).sort({
      created_at: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const { items, total, shipping_address } = req.body;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: User ID missing." });
  }

  if (!items || !total || !shipping_address) {
    return res.status(400).json({
      error: "Missing order details (items, total, or shipping_address)",
    });
  }

  try {
    // Chuẩn bị mảng items (đã được đảm bảo chuyển đổi ObjectId trong logic trước)
    const orderItems = items.map((item: any) => ({
      product_id: new mongoose.Types.ObjectId(item.product_id),
      name: item.name,
      price: item.price,
      qty: item.qty,
      image_url: item.image_url,
    }));

    const order = await Order.create({
      user_id: userId,
      items: orderItems,
      total,
      shipping_address,
      status: "Pending",
    });

    // ✅ FIX LỖI: Trả về orderId VÀ total
    res.status(201).json({
      orderId: order._id,
      total: order.total, // Trả về total để frontend sử dụng
      message: "Order placed successfully",
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};
