import { useCart } from "../context/CartContent";
import "./CartItem.css";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  useProductImageFallback,
} from "../utils/productImage";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { updateCart, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    try {
      await updateCart(item.id, newQuantity);
      onUpdateQuantity && onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item.id);
      onRemove && onRemove(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const itemTotal = (item.price || 0) * item.quantity;

  return (
    <div className="cart-item">
      <div className="item-image">
        <img
          src={item.image_url || PRODUCT_IMAGE_PLACEHOLDER}
          alt={item.name || item.product_name}
          onError={useProductImageFallback}
        />
      </div>
      <div className="item-details">
        <h4>{item.name || item.product_name}</h4>
        <p className="item-sku">SKU: {item.sku}</p>
        <p className="item-price">${(item.price || 0).toFixed(2)}</p>
      </div>
      <div className="item-quantity">
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            handleQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="qty-input"
        />
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(item.quantity + 1)}
        >
          +
        </button>
      </div>
      <div className="item-total">
        <p className="total-price">${itemTotal.toFixed(2)}</p>
      </div>
      <button className="btn-remove" onClick={handleRemove}>
        Remove
      </button>
    </div>
  );
};

export default CartItem;
