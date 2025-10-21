// src/api/cartApi.ts
import { CartItem, Product } from "../types"; // Đảm bảo import đúng

// Thay thế bằng địa chỉ backend thực tế của bạn
const API_BASE_URL = "http://192.168.0.111:5000/api";

// 1. LẤY DỮ LIỆU GIỎ HÀNG
export async function fetchCartItems(): Promise<CartItem[]> {
  try {
    // Gọi đến GET /api/carts
    const response = await fetch(`${API_BASE_URL}/carts`);
    if (!response.ok) throw new Error("Failed to fetch cart.");

    // Tùy thuộc vào controller, có thể cần mapping dữ liệu
    const data = await response.json();
    // Giả sử backend trả về 1 mảng các CartItem
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

// 2. THÊM HOẶC CẬP NHẬT SẢN PHẨM VÀO GIỎ HÀNG (Dùng cho Add to Cart)
export async function addToCart(productId: string, qty: number): Promise<void> {
  try {
    // Gọi đến POST /api/carts/add
    const response = await fetch(`${API_BASE_URL}/carts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    if (!response.ok) throw new Error("Failed to add to cart.");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

// 3. CẬP NHẬT SỐ LƯỢNG (Tăng/Giảm)
export async function updateCartItemQuantity(
  productId: string,
  newQty: number
): Promise<void> {
  try {
    // Gọi đến PUT /api/carts/update/:productId
    const url = `${API_BASE_URL}/carts/update/${productId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: newQty }),
    });
    if (!response.ok) throw new Error("Failed to update cart quantity.");
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
}

// 4. XÓA GIỎ HÀNG (Dùng sau khi thanh toán thành công)
export async function clearCart(): Promise<void> {
  try {
    // Gọi đến DELETE /api/carts/clear
    const response = await fetch(`${API_BASE_URL}/carts/clear`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear cart.");
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
