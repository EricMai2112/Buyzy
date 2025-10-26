const API_BASE_URL = "http://172.20.10.2:5000/api";

export async function createOrder(
  orderData: any
): Promise<{ orderId: string; total: number }> {
  try {
    // Gọi đến POST /api/orders
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    // 1. Kiểm tra trạng thái HTTP (201 Created là thành công)
    if (!response.ok) {
      // Nếu trạng thái lỗi (4xx, 5xx), cố gắng lấy thông báo lỗi từ body
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.error || `Failed to place order: ${response.status}`
        );
      } catch {
        // Nếu không phải JSON, ném lỗi chung
        throw new Error(
          `Failed to place order. Server responded with status ${response.status}.`
        );
      }
    }

    // 2. PHÂN TÍCH RESPONSE JSON (Backend đã được sửa để trả về { orderId, total })
    const data = await response.json();

    // 3. Kiểm tra tính hợp lệ của dữ liệu (safety check)
    if (!data.orderId || data.total === undefined) {
      throw new Error("Invalid server response: Missing order ID or total.");
    }

    // Trả về dữ liệu cần thiết
    return { orderId: data.orderId, total: data.total };
  } catch (error) {
    console.error("Error placing order:", error);
    // Ném lỗi lên để CheckoutScreen xử lý
    throw error;
  }
}
