import "./ProductCard.css";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  useProductImageFallback,
} from "../utils/productImage";

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  const { t } = useTranslation();
  const localizedProduct = getLocalizedProduct(t, product);
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image_url || PRODUCT_IMAGE_PLACEHOLDER}
          alt={localizedProduct.name}
          onError={useProductImageFallback}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{localizedProduct.name}</h3>
        <p className="product-sku">{t("common.sku")}: {product.sku}</p>
        <p className="product-description">
          {localizedProduct.description.substring(0, 80)}...
        </p>
        <div className="product-footer">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <div className="product-actions">
            <button
              className="btn-secondary"
              onClick={() => onViewDetails(product.id)}
            >
              {t("common.view")}
            </button>
            <button
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              {t("product.addToCart")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
