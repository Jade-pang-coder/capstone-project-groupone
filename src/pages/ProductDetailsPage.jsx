import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProductById } from "../api/productApi";
import {
  getLocalizedCategoryName,
  getLocalizedProduct,
} from "../i18n/catalog";
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
  const { t, i18n } = useTranslation();
  const localizedProduct = getLocalizedProduct(t, product);

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
      setError("product.detailsLoadFailed");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart(product, quantity);
        alert(t("product.added", { name: localizedProduct.name }));
        setQuantity(1);
      }
    } catch {
      alert(t("product.addFailed"));
    }
  };

  if (loading) return <div className="loading">{t("product.detailsLoading")}</div>;
  if (error) return <div className="error-message">{t(error)}</div>;
  if (!product) return <div className="error-message">{t("product.notFound")}</div>;

  return (
    <div className="product-details-page">
      <button className="btn-back" onClick={() => onNavigate("products")}>
        {t("product.back")}
      </button>

      <div className="product-details">
        <div className="product-image-section">
          <img
            src={product.image_url || PRODUCT_IMAGE_PLACEHOLDER}
            alt={localizedProduct.name}
            className="product-image-large"
            onError={useProductImageFallback}
          />
        </div>

        <div className="product-info-section">
          <h1>{localizedProduct.name}</h1>
          <p className="product-sku">{t("common.sku")}: {product.sku}</p>

          <div className="product-rating">
            <span className="rating">★★★★★ (4.5/5)</span>
            <span className="reviews">{t("product.reviews", { count: 128 })}</span>
          </div>

          <div className="product-price-section">
            <span className="price">${product.price?.toFixed(2)}</span>
            <span
              className={`availability ${product.is_active ? "in-stock" : "out-of-stock"}`}
            >
              {product.is_active ? t("product.inStock") : t("product.outOfStock")}
            </span>
          </div>

          <div className="product-description">
            <h3>{t("product.description")}</h3>
            <p>{localizedProduct.description}</p>
          </div>

          <div className="product-purchase">
            <div className="quantity-selector">
              <label htmlFor="quantity">{t("common.quantity")}:</label>
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
                {t("product.addToCart")}
              </button>
              <button
                className="btn-secondary"
                onClick={() => onNavigate("cart")}
              >
                {t("product.viewCart")}
              </button>
            </div>
          </div>

          <div className="product-meta">
            <p>
              <strong>{t("product.category")}</strong>{" "}
              {product.category_name
                ? getLocalizedCategoryName(t, { name: product.category_name })
                : t("common.uncategorized")}
            </p>
            <p>
              <strong>{t("product.addedDate")}</strong>{" "}
              {new Date(product.created_at).toLocaleDateString(i18n.language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
