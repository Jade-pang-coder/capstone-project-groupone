import { useEffect, useState } from "react";
import { getProductById } from "../api/productApi";
import { useCart } from "../context/CartContent";
import "../pages/ProductDetailsPage.css";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  useProductImageFallback,
} from "../utils/productImage";

const ProductDetailsPage = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product details");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart(product, quantity);
        alert(`${product.name} added to cart!`);
        setQuantity(1);
      }
    } catch {
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-details-page">
      <button className="btn-back" onClick={() => onNavigate("products")}>
        ← Back to Products
      </button>

      <div className="product-details">
        <div className="product-image-section">
          <img
            src={product.image_url || PRODUCT_IMAGE_PLACEHOLDER}
            alt={product.name}
            className="product-image-large"
            onError={useProductImageFallback}
          />
        </div>

        <div className="product-info-section">
          <h1>{product.name}</h1>
          <p className="product-sku">SKU: {product.sku}</p>

          <div className="product-rating">
            <span className="rating">★★★★★ (4.5/5)</span>
            <span className="reviews">(128 reviews)</span>
          </div>

          <div className="product-price-section">
            <span className="price">${product.price?.toFixed(2)}</span>
            <span
              className={`availability ${product.is_active ? "in-stock" : "out-of-stock"}`}
            >
              {product.is_active ? "✓ In Stock" : "✗ Out of Stock"}
            </span>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-purchase">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-input">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="purchase-buttons">
              <button
                className="btn-primary"
                onClick={handleAddToCart}
                disabled={!product.is_active}
              >
                Add to Cart
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate("cart")}
              >
                View Cart
              </button>
            </div>
          </div>

          <div className="product-meta">
            <p>
              <strong>Category:</strong>{" "}
              {product.category_name || "Uncategorized"}
            </p>
            <p>
              <strong>Added:</strong>{" "}
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
