import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import { getOrderById } from "../api/orderApi";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import { useAuth } from "../context/AuthContext";
import "../pages/OrderConfirmationPage.css";

const OrderConfirmationPage = ({ orderId, onNavigate }) => {
  const { token, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, token]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        const saved = JSON.parse(localStorage.getItem("eshop:guest:last_order") || "null");
        if (saved && String(saved.order?.id) === String(orderId)) {
          setOrder(saved.order);
          setOrderItems(saved.items || []);
          return;
        }
        throw new Error("Guest order details are not available in this browser");
      }
      const orderData = await getOrderById(orderId, token);
      setOrder(orderData);

      const itemsData = await getOrderItemsByOrderId(orderId, token);
      setOrderItems(itemsData);
    } catch (err) {
      setError("order.loadFailed");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">{t("order.loading")}</div>;
  if (error) return <div className="error-message">{t(error)}</div>;
  if (!order) return <div className="error-message">{t("order.notFound")}</div>;

  const handleGuestOrderHistory = () => {
    const openTracking = window.confirm(
      t("order.guestConfirm"),
    );
    if (openTracking) {
      onNavigate(
        `track-order/${encodeURIComponent(order.order_number || "")}`,
      );
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>{t("order.confirmed")}</h2>
          <p>{t("order.confirmedMessage")}</p>
        </div>

        <div className="order-info">
          <div className="info-card">
            <h3>{t("order.number")}</h3>
            <p className="order-number">#{order.order_number || order.id}</p>
          </div>

          <div className="info-card">
            <h3>{t("order.orderStatus")}</h3>
            <p className={`status ${order.status}`}>
              {order.status.toUpperCase()}
            </p>
          </div>

          <div className="info-card">
            <h3>{t("order.date")}</h3>
            <p>{new Date(order.created_at).toLocaleDateString(i18n.language)}</p>
          </div>
        </div>

        <div className="order-details">
          <div className="section">
            <h3>{t("checkout.shippingInfo")}</h3>
            <div className="info">
              <p>
                <strong>{order.customer_name}</strong>
              </p>
              <p>{order.shipping_address}</p>
              <p>{order.phone}</p>
            </div>
          </div>

          <div className="section">
            <h3>{t("order.items")}</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>{t("common.product")}</th>
                  <th>{t("common.sku")}</th>
                  <th>{t("common.quantity")}</th>
                  <th>{t("common.unitPrice")}</th>
                  <th>{t("common.total")}</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={item.id || `${item.product_id}-${index}`}>
                    <td>{getLocalizedProduct(t, item).name}</td>
                    <td>{item.sku}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.unit_price || 0).toFixed(2)}</td>
                    <td>${Number(item.line_total ?? item.subtotal ?? 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section order-summary-section">
            <div className="summary-row">
              <span>{t("common.subtotal")}:</span>
              <span>${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>{t("common.discount")}:</span>
              <span>-${(order.discount_amount || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>{t("common.total")}:</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          {isAuthenticated && (
            <button
              className="btn-primary"
              onClick={() => onNavigate("dashboard")}
            >
              {t("order.viewAll")}
            </button>
          )}
          {!isAuthenticated && (
            <>
              <button
                className="btn-secondary"
                onClick={handleGuestOrderHistory}
              >
                {t("order.viewAll")}
              </button>
              <button
                className="btn-primary"
                onClick={() =>
                  onNavigate(
                    `track-order/${encodeURIComponent(
                      order.order_number || "",
                    )}`,
                  )
                }
              >
                {t("order.trackThis")}
              </button>
            </>
          )}
          <button className="btn-secondary" onClick={() => onNavigate("home")}>
            {t("cart.continueShopping")}
          </button>
        </div>

        <div className="email-confirmation">
          <p>
            {t("order.emailSent", {
              email: order.customer_email || t("order.providedEmail"),
            })}
          </p>
          {isAuthenticated ? (
            <p>{t("order.dashboardTracking")}</p>
          ) : (
            <p>
              {t("order.saveNumber", {
                number: order.order_number || order.id,
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
