import { Product } from "../types";

const BASE = "http://192.168.0.111:5000/api";
export async function fetchProducts(categoryId?: string): Promise<Product[]> {
  try {
    let url = `${BASE}/products`;
    // ✅ THÊM LOGIC LỌC SẢN PHẨM Ở BACKEND
    if (categoryId) {
      // LƯU Ý: Backend cần hỗ trợ endpoint này (GET /api/products?category=...)
      url = `${BASE}/products?category=${categoryId}`;
    }

    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchProductById(id: string) {
  try {
    const res = await fetch(`${BASE}/products/${id}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
