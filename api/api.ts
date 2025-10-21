const BASE = "http://172.16.3.202:5000/api";
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
