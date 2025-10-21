import { useState, useCallback } from "react";
import { CartItem, Product } from "../index"; // Giả sử types có sẵn

export function useCartState() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (i) => i.product_id === product._id
      );

      if (existingItem) {
        // Tăng số lượng nếu sản phẩm đã có
        return currentItems.map((i) =>
          i.product_id === product._id ? { ...i, qty: i.qty + quantity } : i
        );
      } else {
        // Thêm mới sản phẩm
        const newItem: CartItem = {
          product_id: product._id,
          name: product.name,
          price: product.price,
          qty: quantity,
        };
        return [...currentItems, newItem];
      }
    });
  }, []);

  const updateQuantity = useCallback((productId: string, newQty: number) => {
    setItems((currentItems) => {
      if (newQty <= 0) {
        // Xóa sản phẩm nếu số lượng <= 0
        return currentItems.filter((i) => i.product_id !== productId);
      }
      // Cập nhật số lượng
      return currentItems.map((i) =>
        i.product_id === productId ? { ...i, qty: newQty } : i
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return { items, addToCart, updateQuantity, clearCart };
}

// **LƯU Ý:** Bạn cần đặt `useCartState` trong một Context Provider ở component gốc (ví dụ: `App.tsx`) và tạo một `useCart` hook để truy cập nó trong toàn bộ ứng dụng.
// Vì tôi không thể thay đổi App.tsx, tôi sẽ **chỉnh sửa CartScreen và ProductDetailScreen để MOCK sử dụng hook này cho mục đích demo logic**.
// Trong môi trường thực, bạn PHẢI sử dụng Context API.
