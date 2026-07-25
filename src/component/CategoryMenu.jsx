import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";
import "./CategoryMenu.css";

const CategoryMenu = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="category-menu">Loading categories...</div>;
  if (error) return <div className="category-menu error">{error}</div>;

  return (
    <div className="category-menu">
      <h3>Categories</h3>
      <div className="category-list">
        <button
          className="category-item"
          onClick={() => onSelectCategory(null)}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-item"
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
