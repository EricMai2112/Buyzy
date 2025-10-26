// src/api/cartApi.ts
import { CartItem, Product } from "../types"; // Đảm bảo import đúng

interface UpdateCartItemParams {
  product_id: string;
  qty: number;
  color?: string;
  size?: string;
}
const API_BASE_URL = "http://172.20.10.2:5000/api";

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
export async function addToCart(
  productId: string,
  qty: number,
  // ✅ THÊM 2 THAM SỐ MỚI
  color?: string | null,
  size?: string | null
): Promise<void> {
  try {
    // Gọi đến POST /api/carts/add
    const response = await fetch(`${API_BASE_URL}/carts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ GỬI CẢ COLOR VÀ SIZE ĐẾN BACKEND
      body: JSON.stringify({ productId, qty, color, size }),
    });
    if (!response.ok) throw new Error("Failed to add to cart.");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  // ✅ Thay thế 2 đối số cũ bằng 1 đối tượng duy nhất
  params: UpdateCartItemParams
): Promise<void> {
  const { product_id, qty, color, size } = params;

  try {
    // Backend API của bạn hiện chỉ dùng productId trong URL (PUT /api/carts/update/:productId)
    // Nếu bạn muốn giữ API URL này, hãy dùng product_id:
    const url = `${API_BASE_URL}/carts/update/${product_id}`;

    // ✅ Gửi cả variants và số lượng trong body
    const response = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        qty: qty,
        color: color,
        size: size,
      }),
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
