import { useState } from "react";
import { createOrder } from "../api/orderApi";
import { createOrderItem } from "../api/orderItemApi";
import { getProductById } from "../api/productApi";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../api/authApi";
import { useCart } from "../context/CartContent";
import "../pages/CheckoutPage.css";

const CheckoutPage = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    shipping_address: user?.address || "",
    phone: user?.phone || "",
    payment_method: "credit_card",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.shipping_address ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isRegisteredCustomer = Boolean(user?.id && token);
      let checkoutUser = user;

      if (isRegisteredCustomer) {
        checkoutUser = await getUserProfile(user.id, token);
        if (!checkoutUser?.email) {
          throw new Error(
            "Your customer profile does not include an email address",
          );
        }
      }

      const checkoutItems = await Promise.all(
        cart.map(async (item) => {
          const productId = item.product_id || item.id;
          if (!productId) {
            throw new Error("A cart item is missing its product ID");
          }

          const product = await getProductById(productId);
          const quantity = Number(item.quantity);
          if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error(`Invalid quantity for ${product.name}`);
          }

          return {
            product_id: product.id,
            sku: product.sku,
            product_title: product.name,
            unit_price: Number(product.price),
            quantity,
            subtotal: Number(product.price) * quantity,
          };
        }),
      );

      const subtotal = checkoutItems.reduce(
        (total, item) => total + item.subtotal,
        0,
      );
      const discount = isRegisteredCustomer
        ? Number(checkoutUser.discount_percentage || 0)
        : 0;
      const discountAmount = subtotal * (discount / 100);
      const orderNonce = crypto.randomUUID();
      const orderData = {
        user_id: isRegisteredCustomer ? checkoutUser.id : null,
        order_code: `ORD-${Date.now()}-${orderNonce.slice(0, 8)}`,
        auth_token: `order-${orderNonce}`,
        customer_type: isRegisteredCustomer ? "Registered" : "Guest",
        customer_name: formData.customer_name,
        customer_email: isRegisteredCustomer
          ? checkoutUser.email
          : formData.customer_email.trim().toLowerCase(),
        customer_phone: formData.phone,
        shipping_address: formData.shipping_address,
        subtotal_amount: subtotal,
        discount_amount: discountAmount,
        total_amount: subtotal - discountAmount,
        status: "pending",
      };

      const response = await createOrder(orderData, token);
      if (!response?.id) {
        throw new Error("The server created an invalid order response");
      }

      for (const item of checkoutItems) {
        await createOrderItem({ ...item, order_id: response.id }, token);
      }
      await clearCart();
      onNavigate(`order-confirmation/${response.id}`);
    } catch (err) {
      setError(err.message || "Failed to create order");
      console.error("Error creating order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button
            className="btn-primary"
            onClick={() => onNavigate("products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h2>Checkout</h2>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <div className="form-section">
                <h3>Shipping Information</h3>
                <div className="form-group">
                  <label htmlFor="customer_name">Full Name *</label>
                  <input
                    id="customer_name"
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer_email">Email Address *</label>
                  <input
                    id="customer_email"
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    readOnly={Boolean(user?.email)}
                    autoComplete="email"
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_address">Address *</label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your shipping address"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      name="payment_method"
                      value="credit_card"
                      checked={formData.payment_method === "credit_card"}
                      onChange={handleInputChange}
                    />
                    Credit Card
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      name="payment_method"
                      value="debit_card"
                      checked={formData.payment_method === "debit_card"}
                      onChange={handleInputChange}
                    />
                    Debit Card
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      name="payment_method"
                      value="paypal"
                      checked={formData.payment_method === "paypal"}
                      onChange={handleInputChange}
                    />
                    PayPal
                  </label>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onNavigate("cart")}
                  disabled={loading}
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>

          <aside className="checkout-summary">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
