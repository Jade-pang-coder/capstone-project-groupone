import CartItem from "../component/CartItem";
import { useCart } from "../context/CartContent";
import "../pages/CartPage.css";

const CartPage = ({ onNavigate }) => {
  const { cart, getTotalPrice } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    onNavigate("checkout");
  };

  const handleContinueShopping = () => {
    onNavigate("products");
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Start shopping to add items to your cart</p>
            <button className="btn-primary" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span>Action</span>
              </div>
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <CartItem key={item.id ?? `${item.product_id}-${idx}`} item={item} />
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="btn-primary btn-block"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                <button
                  className="btn-secondary btn-block"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>

              <div className="promo-card">
                <h4>Promo Code</h4>
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="promo-input"
                />
                <button className="btn-secondary btn-block">Apply Code</button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
