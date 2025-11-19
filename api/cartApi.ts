// src/api/cartApi.ts
import { CartItem, Product } from "../types";

interface UpdateCartItemParams {
  product_id: string;
  qty: number;
  color?: string;
  size?: string;
}
const API_BASE_URL = "https://buyzy-production.up.railway.app/api";

export async function fetchCartItems(): Promise<CartItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/carts`);
    if (!response.ok) throw new Error("Failed to fetch cart.");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

export async function addToCart(
  productId: string,
  qty: number,
  color?: string | null,
  size?: string | null
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty, color, size }),
    });
    if (!response.ok) throw new Error("Failed to add to cart.");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItemQuantity(
  params: UpdateCartItemParams
): Promise<void> {
  const { product_id, qty, color, size } = params;

  try {
    const url = `${API_BASE_URL}/carts/update/${product_id}`;

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

export async function clearCart(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/clear`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to clear cart.");
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}
