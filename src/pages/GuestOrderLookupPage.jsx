import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import "./OrderConfirmationPage.css";

const GuestOrderLookupPage = ({ initialOrderCode = "", onNavigate }) => {
  const [orderCode, setOrderCode] = useState(initialOrderCode);
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleLookup = async (event) => {
    event.preventDefault();
    const normalizedCode = orderCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError(t("tracking.required"));
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);
    setOrderItems([]);

    try {
      let savedOrders = [];
      try {
        savedOrders = JSON.parse(localStorage.getItem("eshop:guest:orders") || "[]");
        const legacyOrder = JSON.parse(
          localStorage.getItem("eshop:guest:last_order") || "null",
        );
        if (legacyOrder) savedOrders.push(legacyOrder);
      } catch {
        savedOrders = [];
      }

      const matchingRecord = savedOrders.find(
        ({ order: candidate }) =>
          candidate?.order_code?.toUpperCase() === normalizedCode ||
          candidate?.order_number?.toUpperCase() === normalizedCode,
      );

      if (!matchingRecord) {
        throw new Error(t("tracking.notFound"));
      }

      setOrder(matchingRecord.order);
      setOrderItems(matchingRecord.items || []);
    } catch (lookupError) {
      setError(lookupError.message || t("tracking.retrieveFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="section">
          <h2>{t("tracking.title")}</h2>
          <p>{t("tracking.instructions")}</p>
          <form onSubmit={handleLookup} className="checkout-form">
            <div className="form-group">
              <label htmlFor="guest-order-code">{t("order.number")}</label>
              <input
                id="guest-order-code"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                placeholder={t("tracking.placeholder")}
                autoComplete="off"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? t("tracking.finding") : t("tracking.viewOrder")}
            </button>
          </form>
        </div>

        {order && (
          <div className="order-details">
            <div className="order-info">
              <div className="info-card">
                <h3>{t("order.number")}</h3>
                <p className="order-number">
                  #{order.order_number || order.id}
                </p>
              </div>
              <div className="info-card">
                <h3>{t("common.status")}</h3>
                <p className={`status ${order.status}`}>{order.status}</p>
              </div>
              <div className="info-card">
                <h3>{t("common.total")}</h3>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="section">
              <h3>{t("checkout.shippingInfo")}</h3>
              <p>
                <strong>{order.customer_name}</strong>
              </p>
              <p>{order.shipping_address}</p>
            </div>

            <div className="section">
              <h3>{t("order.items")}</h3>
              {orderItems.length ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>{t("common.product")}</th>
                      <th>{t("common.sku")}</th>
                      <th>{t("common.quantity")}</th>
                      <th>{t("common.total")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={item.id || `${item.product_id}-${index}`}>
                        <td>{getLocalizedProduct(t, item).name}</td>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.line_total ?? item.subtotal ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{t("order.noItems")}</p>
              )}
            </div>

            <button
              className="btn-secondary"
              onClick={() => onNavigate("products")}
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestOrderLookupPage;
