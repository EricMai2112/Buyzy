const BASE = "http://192.168.0.111:5000/api";
export async function fetchProducts() {
  try {
    const res = await fetch(`${BASE}/products`);
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
