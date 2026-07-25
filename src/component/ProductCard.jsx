import "./ProductCard.css";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  useProductImageFallback,
} from "../utils/productImage";

const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image_url || PRODUCT_IMAGE_PLACEHOLDER}
          alt={product.name}
          onError={useProductImageFallback}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-sku">SKU: {product.sku}</p>
        <p className="product-description">
          {product.description?.substring(0, 80)}...
        </p>
        <div className="product-footer">
          <span className="product-price">${product.price?.toFixed(2)}</span>
          <div className="product-actions">
            <button
              className="btn-secondary"
              onClick={() => onViewDetails(product.id)}
            >
              View
            </button>
            <button
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
