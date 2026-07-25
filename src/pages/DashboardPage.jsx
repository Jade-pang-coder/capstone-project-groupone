import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchOrders();
  }, [token, user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders(token);
      setOrders(data || []);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrder = async (orderId) => {
    try {
      const [orderData, itemsData] = await Promise.all([
        getOrderById(orderId, token),
        getOrderItemsByOrderId(orderId, token),
      ]);
      setSelectedOrder(orderData);
      setOrderItems(itemsData);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    }
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-page">
        <div className="container">
          <div className="dashboard-header">
            <h2>My Dashboard</h2>
            <p>Welcome back, {user?.name}!</p>
          </div>

          <div className="dashboard-grid">
            <aside className="orders-list-section">
              <h3>My Orders</h3>
              {loading && <div className="loading">Loading orders...</div>}
              {error && <div className="error-message">{error}</div>}

              {orders.length === 0 ? (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <button
                    className="btn-primary"
                    onClick={() => onNavigate("products")}
                  >
                    Start Shopping
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
                          {new Date(order.created_at).toLocaleDateString()}
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
                  <h3>Order Details</h3>
                  <div className="details-card">
                    <div className="detail-row">
                      <span className="label">Order Number:</span>
                      <span className="value">
                        #{selectedOrder.order_number || selectedOrder.id}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className={`value status ${selectedOrder.status}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date Placed:</span>
                      <span className="value">
                        {new Date(
                          selectedOrder.created_at,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Shipping Address:</span>
                      <span className="value">
                        {selectedOrder.shipping_address}
                      </span>
                    </div>
                  </div>

                  <h4>Items Ordered</h4>
                  {orderItems.length > 0 ? (
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.sku}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.unit_price || 0).toFixed(2)}</td>
                            <td>${(item.line_total || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No items found for this order.</p>
                  )}

                  <div className="order-total">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>${(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="total-row">
                      <span>Discount:</span>
                      <span>
                        ${(selectedOrder.discount_amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="total-row final">
                      <span>Total:</span>
                      <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    className="btn-secondary"
                    onClick={() => onNavigate("products")}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="no-selection">
                  <p>Select an order to view details</p>
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
