import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
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
  const { t } = useTranslation();
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
      setError(t("cart.empty"));
      return;
    }

    if (
      !formData.customer_name ||
      !formData.customer_email ||
      !formData.shipping_address ||
      !formData.phone
    ) {
      setError(t("checkout.required"));
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
            t("checkout.profileEmailMissing"),
          );
        }
      }

      const checkoutItems = await Promise.all(
        cart.map(async (item) => {
          const productId = item.product_id || item.id;
          if (!productId) {
            throw new Error(t("checkout.productIdMissing"));
          }

          const product = await getProductById(productId);
          const quantity = Number(item.quantity);
          if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error(t("checkout.invalidQuantity", { name: product.name }));
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
        throw new Error(t("checkout.invalidResponse"));
      }

      for (const item of checkoutItems) {
        await createOrderItem({ ...item, order_id: response.id }, token);
      }
      await clearCart();
      onNavigate(`order-confirmation/${response.id}`);
    } catch (err) {
      setError(err.message || t("checkout.createFailed"));
      console.error("Error creating order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>{t("cart.empty")}</h2>
          <button
            className="btn-primary"
            onClick={() => onNavigate("products")}
          >
            {t("cart.continueShopping")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h2>{t("checkout.title")}</h2>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmitOrder} className="checkout-form">
              <div className="form-section">
                <h3>{t("checkout.shippingInfo")}</h3>
                <div className="form-group">
                  <label htmlFor="customer_name">{t("checkout.fullNameRequired")}</label>
                  <input
                    id="customer_name"
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    placeholder={t("auth.enterName")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customer_email">{t("checkout.emailRequired")}</label>
                  <input
                    id="customer_email"
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    readOnly={Boolean(user?.email)}
                    autoComplete="email"
                    placeholder={t("checkout.enterEmail")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping_address">{t("checkout.addressRequired")}</label>
                  <textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    placeholder={t("checkout.enterAddress")}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t("checkout.phoneRequired")}</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder={t("checkout.enterPhone")}
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>{t("checkout.paymentMethod")}</h3>
                <div className="form-group">
                  <label>
                    <input
                      type="radio"
                      name="payment_method"
                      value="credit_card"
                      checked={formData.payment_method === "credit_card"}
                      onChange={handleInputChange}
                    />
                    {t("checkout.creditCard")}
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
                    {t("checkout.debitCard")}
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
                    {t("checkout.paypal")}
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
                  {t("checkout.backToCart")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? t("checkout.processing") : t("checkout.placeOrder")}
                </button>
              </div>
            </form>
          </div>

          <aside className="checkout-summary">
            <div className="order-summary">
              <h3>{t("cart.orderSummary")}</h3>
              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span>
                      {getLocalizedProduct(t, item).name} x {item.quantity}
                    </span>
                    <span>
                      ${((item.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>{t("common.total")}:</span>
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
