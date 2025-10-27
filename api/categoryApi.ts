// src/api/categoryApi.ts
const API_BASE_URL = "http://192.168.0.111:5000/api";

// Giả định Category type
export type Category = {
  _id: string;
  name: string;
  icon_url: string;
};

// Lấy tất cả danh mục
export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
}
