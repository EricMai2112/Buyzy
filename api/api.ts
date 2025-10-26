import { Product } from "../types";

const BASE = "http://172.20.10.2:5000/api";

export async function fetchProducts(
  minPrice?: number,
  maxPrice?: number,
  categoryId?: string
): Promise<Product[]> {
  try {
    let url = `${BASE}/products`;
    const params = [];

    if (categoryId) {
      params.push(`category=${categoryId}`);
    }

    if (minPrice !== undefined && minPrice !== null) {
      params.push(`minPrice=${minPrice}`);
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      params.push(`maxPrice=${maxPrice}`);
    }

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    console.log("Fetching products from URL:", url);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`API call failed with status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Error in fetchProducts:", err);
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
