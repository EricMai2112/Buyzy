// cartController.ts (PHIÊN BẢN HOÀN CHỈNH VÀ ĐÃ FIX LỖI TREO)

import { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "../utils/getUserIdFromRequest";

const getUserId = (req: Request): mongoose.Types.ObjectId | null => {
  return getUserIdFromRequest(req); // ✅ Dùng Helper mới
};

export const getCarts = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = await Cart.findOne({ user_id: userId });

    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// 🎯 HÀM THÊM/CẬP NHẬT SẢN PHẨM VÀO GIỎ HÀNG
export const addToCart = async (req: Request, res: Response) => {
  const { productId, qty, color, size } = req.body;

  if (!productId || qty === undefined || qty < 1) {
    return res.status(400).json({ error: "Invalid productId or quantity" });
  }

  try {
    const userId = getUserId(req);
    let cart = await Cart.findOne({ user_id: userId });

    const productDetail = await Product.findById(productId);
    if (!productDetail) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.product_id.toString() === productId &&
        item.color === color && // ✅ SO SÁNH CẢ VARIANTS
        item.size === size // ✅ SO SÁNH CẢ VARIANTS
    );

    if (itemIndex > -1) {
      // 3. Nếu có, tăng số lượng
      cart.items[itemIndex].qty += qty;
    } else {
      // 4. Nếu chưa có, thêm sản phẩm mới
      cart.items.push({
        product_id: productId,
        name: productDetail.name,
        price: productDetail.price,
        qty: qty,
        image_url: productDetail.image_url,
        // ✅ LƯU VARIANTS ĐÃ CHỌN
        color: color,
        size: size,
      });
    }

    // Tính lại subtotal (đã fix lỗi TypeScript)
    cart.subtotal = cart.items.reduce((sum, item) => {
      const price = item.price ?? 0;
      const qty = item.qty ?? 0;
      return sum + price * qty;
    }, 0);

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// 🎯 HÀM CẬP NHẬT SỐ LƯỢNG (Dùng cho nút +/-)
export const updateCartItem = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { qty, color, size } = req.body;

  if (qty === undefined) {
    return res.status(400).json({ error: "Missing quantity" });
  }

  try {
    const userId = getUserId(req);
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) =>
        item.product_id.toString() === productId &&
        (item.color || "") === (color || "") && // So sánh, xử lý trường hợp undefined/null
        (item.size || "") === (size || "") // So sánh, xử lý trường hợp undefined/null
    );

    if (itemIndex > -1) {
      if (qty <= 0) {
        // Xóa sản phẩm nếu qty <= 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Cập nhật số lượng
        cart.items[itemIndex].qty = qty;
      } // Tính lại subtotal (giữ nguyên)

      cart.subtotal = cart.items.reduce((sum, item) => {
        const price = item.price ?? 0;
        const qty = item.qty ?? 0;
        return sum + price * qty;
      }, 0);

      await cart.save(); // Trả về toàn bộ giỏ hàng đã cập nhật
      return res.json(cart.items);
    } else {
      // Nếu item không tồn tại, có thể do giỏ hàng đã được làm mới hoặc đã bị xóa
      return res
        .status(404)
        .json({ error: "Product variant not found in cart" });
    }
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// 🎯 HÀM XÓA GIỎ HÀNG (FIXED: Sửa lỗi treo giao diện)
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    // ✅ Dùng updateOne để xử lý reset mảng items và subtotal nhanh chóng
    const result = await Cart.updateOne(
      { user_id: userId },
      { $set: { items: [], subtotal: 0 } }
    );

    // Kiểm tra xem có giỏ hàng nào được update không
    if (result.matchedCount === 0) {
      // Vẫn gửi 200 OK nếu giỏ hàng không tồn tại, vì mục đích là clear cart
      return res.json({ message: "Cart not found or already cleared." });
    }

    // ✅ PHẢI CÓ DÒNG NÀY: Gửi phản hồi HTTP thành công
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    // Gửi lỗi 500 nếu có lỗi database
    console.error("Error clearing cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
