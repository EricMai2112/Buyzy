// orderController.ts (FIXED: Đảm bảo trả về order.total)
import { Request, Response } from "express";
import { Order } from "../models/Order";
import mongoose from "mongoose";

// ***************************************************************
// LƯU Ý QUAN TRỌNG: MOCK_USER_ID chỉ dùng cho mục đích demo.
// ***************************************************************
const MOCK_USER_ID = "60c72b2f9c1b4c001f3e7a0b";
const getUserId = (req: Request): mongoose.Types.ObjectId => {
  // return req.user.id;
  return new mongoose.Types.ObjectId(MOCK_USER_ID);
};

export const getOrders = async (_: Request, res: Response) => {
  const orders = await Order.find();
  res.json(orders);
};

export const createOrder = async (req: Request, res: Response) => {
  const { items, total, shipping_address } = req.body;

  if (!items || !total || !shipping_address) {
    return res
      .status(400)
      .json({
        error: "Missing order details (items, total, or shipping_address)",
      });
  }

  try {
    const userId = getUserId(req);

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
