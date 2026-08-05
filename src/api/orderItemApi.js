const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const normalizeOrderItem = (item) => ({
  ...item,
  product_name: item.product_name || item.product_title,
  unit_price: Number(item.unit_price ?? 0),
  line_total: Number(item.line_total ?? item.subtotal ?? 0),
  quantity: Number(item.quantity),
});

const readResponse = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }
  return data;
};

// Get all order items
export const getOrderItems = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/order-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order items");
    }
    return (await readResponse(response, "Failed to fetch order items")).map(
      normalizeOrderItem,
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

// Get order items by order ID
export const getOrderItemsByOrderId = async (orderId, token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/order-items/order/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch order items");
    }
    return (await readResponse(response, "Failed to fetch order items")).map(
      normalizeOrderItem,
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

export const createOrderItem = async (orderItemData, token) => {
  const response = await fetch(`${API_BASE_URL}/order-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      order_id: orderItemData.order_id,
      product_id: orderItemData.product_id,
      sku: orderItemData.sku,
      product_title: orderItemData.product_title,
      unit_price: orderItemData.unit_price,
      quantity: orderItemData.quantity,
      subtotal: orderItemData.subtotal,
    }),
  });

  const data = await readResponse(response, "Failed to create order item");
  return normalizeOrderItem(data.order_item || data);
};
