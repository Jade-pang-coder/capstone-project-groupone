const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

// Build headers — omit Authorization when token is null/undefined
const buildHeaders = (token, extra = {}) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extra,
});

// Get all carts
export const getCarts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch carts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching carts:", error);
    throw error;
  }
};

// Get cart by ID
export const getCartById = async (cartId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
      method: "GET",
      headers: buildHeaders(token),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Create cart
export const createCart = async (cartData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts`, {
      method: "POST",
      headers: buildHeaders(token),
      body: JSON.stringify(cartData),
    });
    if (!response.ok) {
      throw new Error("Failed to create cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};

// Update cart
export const updateCart = async (cartId, cartData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
      method: "PUT",
      headers: buildHeaders(token),
      body: JSON.stringify(cartData),
    });
    if (!response.ok) {
      throw new Error("Failed to update cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

// Delete cart
export const deleteCart = async (cartId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting cart:", error);
    throw error;
  }
};
