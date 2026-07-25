const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const readResponse = async (response, fallbackMessage) => {
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
};

const normalizeOrder = (responseData) => {
  const order = Array.isArray(responseData)
    ? responseData[0]
    : responseData?.order || responseData?.data || responseData;

  return {
    ...order,
    id:
      order?.id ||
      order?.order_id ||
      order?.orderId ||
      responseData?.order_id ||
      responseData?.orderId,
    order_number: order?.order_number || order?.order_code,
    phone: order?.phone || order?.customer_phone,
    subtotal: Number(order?.subtotal ?? order?.subtotal_amount ?? 0),
    discount_amount: Number(order?.discount_amount ?? 0),
    total: Number(order?.total ?? order?.total_amount ?? 0),
  };
};

const normalizeOrders = (orders) =>
  Array.isArray(orders) ? orders.map(normalizeOrder) : [];

// Get all orders
export const getOrders = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    return normalizeOrders(await readResponse(response, "Failed to fetch orders"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch order");
    }
    return normalizeOrder(await readResponse(response, "Failed to fetch order"));
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Create order
export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_id: orderData.user_id,
        order_code: orderData.order_code,
        auth_token: orderData.auth_token,
        customer_type: orderData.customer_type,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        subtotal_amount: orderData.subtotal_amount,
        discount_amount: orderData.discount_amount,
        total_amount: orderData.total_amount,
        status: orderData.status,
      }),
    });
    const createdOrder = normalizeOrder(
      await readResponse(response, "Failed to create order"),
    );

    if (createdOrder.id) return createdOrder;

    // Some deployments return only a success message after insertion.
    // Resolve the new record by its unique order code in that case.
    const orders = await getOrders(token);
    const matchingOrder = orders.find(
      (order) => order.order_code === orderData.order_code,
    );

    if (!matchingOrder) {
      throw new Error("The order was created but could not be retrieved");
    }

    return matchingOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update order
export const updateOrder = async (orderId, orderData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error("Failed to update order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }
    return await response.json();
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
};
