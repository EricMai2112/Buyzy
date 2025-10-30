const API_BASE_URL = "http://192.168.1.104:5000/api";

export interface UserData {
  _id: string;
  name: string;
  role: string;
}
export async function login(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Đăng nhập thất bại. Status: ${response.status}`
      );
    }
    return response.json();
  } catch (networkError) {
    console.error("Network/CORS Error:", networkError);
    throw new Error("Không thể kết nối đến máy chủ API. Kiểm tra IP.");
  }
}
export async function register(
  email: string,
  password: string
): Promise<UserData> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Đăng ký thất bại.");
  }
  return response.json();
}
