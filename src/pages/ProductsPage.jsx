import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import { getProducts } from "../api/productApi";
import ProductCard from "../component/ProductCard";
import CategoryMenu from "../component/CategoryMenu";
import { useCart } from "../context/CartContent";
import "../pages/ProductsPage.css";

const ProductsPage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("product.loadFailed");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      alert(t("product.added", { name: getLocalizedProduct(t, product).name }));
    } catch {
      alert(t("product.addFailed"));
    }
  };

  return (
    <div className="products-page">
      <div className="products-content">
        <aside className="sidebar">
          <CategoryMenu onSelectCategory={setSelectedCategory} />
        </aside>

        <main className="main-content">
          <div className="products-header">
            <h2>{t("category.all")}</h2>
            <div className="search-box">
              <input
                type="text"
                placeholder={t("product.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {error && <div className="error-message">{t(error)}</div>}

          {loading ? (
            <div className="loading">{t("product.loading")}</div>
          ) : (
            <>
              <div className="products-info">
                <p>{t("product.found", { count: filteredProducts.length })}</p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>{t("product.noProducts")}</p>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                    }}
                  >
                    {t("product.clearFilters")}
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(id) => onNavigate(`product/${id}`)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
