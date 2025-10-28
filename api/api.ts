import { Product } from "../types";

const BASE = "http://192.168.0.112:5000/api";
export interface ProductCreateData {
  name: string;
  category_id: string;
  price: number;
  image_url: string;
  rating: number;
  review_count: number;
}
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

export async function createProductApi(
  data: ProductCreateData,
  adminUserId: string
) {
  const url = `${BASE}/products`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": adminUserId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Thêm sản phẩm thất bại. Status: ${response.status}`
    );
  }

  return response.json();
}

export async function updateProductApi(
  productId: string,
  updates: any,
  adminUserId: string
) {
  const url = `${BASE}/products/${productId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": adminUserId,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ||
        `Cập nhật sản phẩm thất bại. Status: ${response.status}`
    );
  }
  return response.json();
}

export async function deleteProductApi(productId: string, adminUserId: string) {
  const url = `${BASE}/products/${productId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "X-User-ID": adminUserId,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `Xóa sản phẩm thất bại. Status: ${response.status}`
    );
  }
  // Trả về tín hiệu thành công (200 OK)
  return;
}
