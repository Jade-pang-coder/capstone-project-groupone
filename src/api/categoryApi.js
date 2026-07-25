const API_BASE_URL = "https://capstone-project-backend-delta.vercel.app/api";

// Get all categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Create category (admin only)
export const createCategory = async (categoryData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error("Failed to create category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update category (admin only)
export const updateCategory = async (categoryId, categoryData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error("Failed to update category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete category (admin only)
export const deleteCategory = async (categoryId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
