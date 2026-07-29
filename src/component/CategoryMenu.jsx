import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCategories } from "../api/categoryApi";
import { getLocalizedCategoryName } from "../i18n/catalog";
import "./CategoryMenu.css";

const CategoryMenu = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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
      setError("category.error");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="category-menu">{t("category.loading")}</div>;
  if (error) return <div className="category-menu error">{t(error)}</div>;

  return (
    <div className="category-menu">
      <h3>{t("category.title")}</h3>
      <div className="category-list">
        <button
          className="category-item"
          onClick={() => onSelectCategory(null)}
        >
          {t("category.all")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className="category-item"
            onClick={() => onSelectCategory(category.id)}
          >
            {getLocalizedCategoryName(t, category)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
