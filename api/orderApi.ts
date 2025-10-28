const API_BASE_URL = "http://192.168.0.112:5000/api";

export async function createOrder(
  orderData: any,
  userId: string
): Promise<{ orderId: string; total: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-ID": userId,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.error || `Failed to place order: ${response.status}`
        );
      } catch {
        throw new Error(
          `Failed to place order. Server responded with status ${response.status}.`
        );
      }
    }

    const data = await response.json();

    if (!data.orderId || data.total === undefined) {
      throw new Error("Invalid server response: Missing order ID or total.");
    }

    return { orderId: data.orderId, total: data.total };
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

export async function fetchOrders(userId: string) {
  const response = await fetch(`${API_BASE_URL}/orders/${userId}`);

  if (!response.ok) {
    throw new Error("Không thể tải đơn hàng.");
  }
  return response.json();
}
