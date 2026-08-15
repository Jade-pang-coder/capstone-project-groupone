import CartItem from "../component/CartItem";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContent";
import { useAuth } from "../context/AuthContext";
import "../pages/CartPage.css";

const CartPage = ({ onNavigate }) => {
  const { cart, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const subtotal = getTotalPrice();
  const discountPercentage = isAuthenticated
    ? Math.min(100, Math.max(0, Number(user?.discount_percentage) || 0))
    : 0;
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;
  const membershipTier = user?.membership_tier || user?.membership_status || "Member";

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(t("cart.empty"));
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
        <h2>{t("cart.title")}</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>{t("cart.empty")}</h3>
            <p>{t("cart.emptyPrompt")}</p>
            <button className="btn-primary" onClick={handleContinueShopping}>
              {t("cart.continueShopping")}
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-header">
                <span>{t("common.product")}</span>
                <span>{t("common.quantity")}</span>
                <span>{t("common.subtotal")}</span>
                <span>{t("common.action")}</span>
              </div>
              <div className="cart-items">
                {cart.map((item, idx) => (
                  <CartItem key={item.id ?? `${item.product_id}-${idx}`} item={item} />
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h3>{t("cart.orderSummary")}</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>{t("common.subtotal")}:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="summary-row discount">
                      <span>
                        {membershipTier} {t("common.discount")} ({discountPercentage}%):
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>{t("common.shipping")}:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="summary-row">
                    <span>{t("common.tax")}:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>{t("common.total")}:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="btn-primary btn-block"
                  onClick={handleCheckout}
                >
                  {t("cart.checkout")}
                </button>
                <button
                  className="btn-secondary btn-block"
                  onClick={handleContinueShopping}
                >
                  {t("cart.continueShopping")}
                </button>
              </div>

              <div className="promo-card">
                <h4>{t("cart.promoCode")}</h4>
                <input
                  type="text"
                  placeholder={t("cart.promoPlaceholder")}
                  className="promo-input"
                />
                <button className="btn-secondary btn-block">
                  {t("cart.applyCode")}
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
