import { useEffect, useState } from "react";
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
      setError("Failed to load data");
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
      alert(`${product.name} added to cart!`);
    } catch {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to E-Shop</h2>
          <p>Discover amazing products at great prices</p>
          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => onNavigate("products")}
            >
              Shop Now
            </button>
            <button
              className="btn-secondary"
              onClick={() => onNavigate("track-order")}
            >
              Track Guest Order
            </button>
          </div>
        </div>
      </section>

      {error && <div className="error-message">{error}</div>}

      <div className="home-content">
        <aside className="sidebar">
          <CategoryMenu onSelectCategory={setSelectedCategory} />
        </aside>

        <main className="main-content">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <>
              <h3>
                {selectedCategory ? "Filtered Products" : "Featured Products"} (
                {filteredProducts.length})
              </h3>
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>No products found in this category.</p>
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedCategory(null)}
                  >
                    View All Products
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
