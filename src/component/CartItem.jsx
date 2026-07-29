import { useCart } from "../context/CartContent";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import "./CartItem.css";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  useProductImageFallback,
} from "../utils/productImage";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { updateCart, removeFromCart } = useCart();
  const { t } = useTranslation();
  const localizedItem = getLocalizedProduct(t, item);

  const handleQuantityChange = async (newQuantity) => {
    try {
      await updateCart(item, newQuantity);
      onUpdateQuantity && onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item);
      onRemove && onRemove(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const qty = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  const itemTotal = price * qty;

  return (
    <div className="cart-item">
      <div className="item-image">
        <img
          src={item.image_url || PRODUCT_IMAGE_PLACEHOLDER}
          alt={localizedItem.name}
          onError={useProductImageFallback}
        />
      </div>
      <div className="item-details">
        <h4>{localizedItem.name}</h4>
        <p className="item-sku">{t("common.sku")}: {item.sku}</p>
        <p className="item-price">${(item.price || 0).toFixed(2)}</p>
      </div>
      <div className="item-quantity">
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(qty - 1)}
          disabled={qty <= 1}
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) =>
            handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="qty-input"
        />
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(qty + 1)}
        >
          +
        </button>
      </div>
      <div className="item-total">
        <p className="total-price">${Number(itemTotal).toFixed(2)}</p>
      </div>
      <button className="btn-remove" onClick={handleRemove}>
        {t("common.remove")}
      </button>
    </div>
  );
};

export default CartItem;
