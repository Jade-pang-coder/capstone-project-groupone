import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import { getProducts } from "../api/productApi";
import ProductCard from "../component/ProductCard";
import CategoryMenu from "../component/CategoryMenu";
import { useCart } from "../context/CartContent";
import "../pages/HomePage.css";

const HomePage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (err) {
      setError("home.loadFailed");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      alert(t("product.added", { name: getLocalizedProduct(t, product).name }));
    } catch {
      alert(t("product.addFailed"));
    }
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h2>{t("home.welcome")}</h2>
          <p>{t("home.tagline")}</p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => onNavigate("products")}
            >
              {t("home.shopNow")}
            </button>
            <button
              className="btn-secondary"
              onClick={() => onNavigate("track-order")}
            >
              {t("home.trackGuest")}
            </button>
          </div>
        </div>
      </section>

      {error && <div className="error-message">{t(error)}</div>}

      <div className="home-content">
        <aside className="sidebar">
          <CategoryMenu onSelectCategory={setSelectedCategory} />
        </aside>

        <main className="main-content">
          {loading ? (
            <div className="loading">{t("product.loading")}</div>
          ) : (
            <>
              <h3>
                {selectedCategory ? t("product.filtered") : t("product.featured")} (
                {filteredProducts.length})
              </h3>
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>{t("product.noCategoryProducts")}</p>
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedCategory(null)}
                  >
                    {t("product.viewAll")}
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

export default HomePage;
