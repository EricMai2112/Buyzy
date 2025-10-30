const API_BASE_URL = "http://192.168.1.104:5000/api";

export type Category = {
  _id: string;
  name: string;
  icon_url: string;
};

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
