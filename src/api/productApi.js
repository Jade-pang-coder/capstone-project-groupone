const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

const normalizeProduct = (product) => ({
  ...product,
  name: product.name || product.title,
  price: Number(product.price ?? product.unit_price ?? 0),
});

const normalizeProducts = (products) =>
  Array.isArray(products) ? products.map(normalizeProduct) : [];

const toApiProduct = (product) => ({
  category_id: product.category_id,
  sku: product.sku,
  title: product.title || product.name,
  description: product.description,
  unit_price: Number(product.unit_price ?? product.price ?? 0),
  image_url: product.image_url || null,
  is_active: product.is_active ?? true,
});

// Get all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return normalizeProducts(await response.json());
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return normalizeProduct(await response.json());
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Search/filter products (optional)
export const searchProducts = async (query) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?search=${encodeURIComponent(query)}`,
    );
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return normalizeProducts(await response.json());
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

// Create product (admin only)
export const createProduct = async (productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(toApiProduct(productData)),
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return normalizeProduct(await response.json());
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (productId, productData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(toApiProduct(productData)),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return normalizeProduct(await response.json());
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (productId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
