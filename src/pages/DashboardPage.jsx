import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocalizedProduct } from "../i18n/catalog";
import { getOrders, getOrderById } from "../api/orderApi";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../component/ProtectedRoute";
import "../pages/DashboardPage.css";

const DashboardPage = ({ onNavigate }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchOrders();
  }, [token, user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders(token);
      const userOrders = (data || []).filter(
        (order) => String(order.user_id) === String(user?.id),
      );
      setOrders(userOrders);
      setSelectedOrder(null);
      setOrderItems([]);
    } catch (err) {
      setError("dashboard.loadFailed");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (orderId) => {
    const ownedOrder = orders.find(
      (order) =>
        String(order.id) === String(orderId) &&
        String(order.user_id) === String(user?.id),
    );
    if (!ownedOrder) {
      setError("dashboard.permissionDenied");
      return;
    }

    try {
      const [orderData, itemsData] = await Promise.all([
        getOrderById(orderId, token),
        getOrderItemsByOrderId(orderId, token),
      ]);
      setSelectedOrder(orderData);
      setOrderItems(itemsData);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("order.loadFailed");
    }
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <h2>{t("dashboard.title")}</h2>
            <p>{t("dashboard.welcome", { name: user?.name })}</p>
          </div>

          <div className="dashboard-grid">
            <aside className="orders-list-section">
              <h3>{t("dashboard.myOrders")}</h3>
              {loading && <div className="loading">{t("dashboard.loading")}</div>}
              {error && <div className="error-message">{t(error)}</div>}

              {orders.length === 0 ? (
                <div className="no-orders">
                  <p>{t("dashboard.noOrders")}</p>
                  <button
                    className="btn-primary"
                    onClick={() => onNavigate("products")}
                  >
                    {t("dashboard.startShopping")}
                  </button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`order-item ${
                        selectedOrder?.id === order.id ? "active" : ""
                      }`}
                      onClick={() => handleSelectOrder(order.id)}
                    >
                      <div className="order-summary">
                        <span className="order-id">
                          #{order.order_number || order.id}
                        </span>
                        <span className={`status ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="order-meta">
                        <span className="date">
                          {new Date(order.created_at).toLocaleDateString(i18n.language)}
                        </span>
                        <span className="price">
                          ${(order.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <main className="order-details-section">
              {selectedOrder ? (
                <div className="order-details">
                  <h3>{t("order.details")}</h3>
                  <div className="details-card">
                    <div className="detail-row">
                      <span className="label">{t("order.number")}:</span>
                      <span className="value">
                        #{selectedOrder.order_number || selectedOrder.id}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{t("common.status")}:</span>
                      <span className={`value status ${selectedOrder.status}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{t("dashboard.datePlaced")}</span>
                      <span className="value">
                        {new Date(
                          selectedOrder.created_at,
                        ).toLocaleDateString(i18n.language)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">{t("dashboard.shippingAddress")}</span>
                      <span className="value">
                        {selectedOrder.shipping_address}
                      </span>
                    </div>
                  </div>

                  <h4>{t("dashboard.itemsOrdered")}</h4>
                  {orderItems.length > 0 ? (
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>{t("common.product")}</th>
                          <th>{t("common.sku")}</th>
                          <th>{t("dashboard.qty")}</th>
                          <th>{t("common.unitPrice")}</th>
                          <th>{t("common.total")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td>{getLocalizedProduct(t, item).name}</td>
                            <td>{item.sku}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.unit_price || 0).toFixed(2)}</td>
                            <td>${(item.line_total || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>{t("dashboard.noItems")}</p>
                  )}

                  <div className="order-total">
                    <div className="total-row">
                      <span>{t("common.subtotal")}:</span>
                      <span>${(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>{t("common.discount")}:</span>
                      <span>
                        ${(selectedOrder.discount_amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="total-row final">
                      <span>{t("common.total")}:</span>
                      <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="btn-secondary"
                    onClick={() => onNavigate("products")}
                  >
                    {t("cart.continueShopping")}
                  </button>
                </div>
              ) : (
                <div className="no-selection">
                  <p>{t("dashboard.selectOrder")}</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
