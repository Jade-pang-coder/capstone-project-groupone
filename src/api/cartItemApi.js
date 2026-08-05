const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const readResponse = async (response, fallbackMessage) => {
  const data =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
};

// Build headers — omit Authorization when token is null/undefined
const buildHeaders = (token, extra = {}) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extra,
});

const requireCartItemId = (cartItemId) => {
  const id = Number(cartItemId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("A valid cart item ID is required");
  }
  return id;
};

// Get all cart items
export const getCartItems = async (token, cartId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart-items`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    const items = await readResponse(response, "Failed to fetch cart items");
    return cartId
      ? items.filter((item) => String(item.cart_id) === String(cartId))
      : items;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error;
  }
};

// Get cart item by ID
export const getCartItemById = async (cartItemId, token) => {
  try {
    const id = requireCartItemId(cartItemId);
    const response = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart item");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart item:", error);
    throw error;
  }
};

// Add item to cart
export const addCartItem = async (cartItemData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart-items`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(cartItemData),
    });
    const data = await readResponse(response, "Failed to add cart item");
    return data.cart_item || data;
  } catch (error) {
    console.error("Error adding cart item:", error);
    throw error;
  }
};

// Update cart item
export const updateCartItem = async (cartItemId, cartItemData, token) => {
  try {
    const id = requireCartItemId(cartItemId);
    const response = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(cartItemData),
    });
    const data = await readResponse(response, "Failed to update cart item");
    return data.cart_item || data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove cart item
export const removeCartItem = async (cartItemId, token) => {
  try {
    const id = requireCartItemId(cartItemId);
    const response = await fetch(`${API_BASE_URL}/cart-items/${id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await readResponse(response, "Failed to remove cart item");
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};
