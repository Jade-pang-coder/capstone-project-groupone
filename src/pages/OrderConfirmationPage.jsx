import { useEffect, useState } from "react";
import { getOrderById } from "../api/orderApi";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import { useAuth } from "../context/AuthContext";
import "../pages/OrderConfirmationPage.css";

const OrderConfirmationPage = ({ orderId, onNavigate }) => {
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, token]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await getOrderById(orderId, token);
      setOrder(orderData);

      const itemsData = await getOrderItemsByOrderId(orderId, token);
      setOrderItems(itemsData);
    } catch (err) {
      setError("Failed to load order details");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading order details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!order) return <div className="error-message">Order not found</div>;

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>
            Thank you for your purchase. Your order has been placed
            successfully.
          </p>
        </div>

        <div className="order-info">
          <div className="info-card">
            <h3>Order Number</h3>
            <p className="order-number">#{order.order_number || order.id}</p>
          </div>

          <div className="info-card">
            <h3>Order Status</h3>
            <p className={`status ${order.status}`}>
              {order.status.toUpperCase()}
            </p>
          </div>

          <div className="info-card">
            <h3>Order Date</h3>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="order-details">
          <div className="section">
            <h3>Shipping Information</h3>
            <div className="info">
              <p>
                <strong>{order.customer_name}</strong>
              </p>
              <p>{order.shipping_address}</p>
              <p>{order.phone}</p>
            </div>
          </div>

          <div className="section">
            <h3>Order Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Quantity</th>
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
          </div>

          <div className="section order-summary-section">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <span>-${(order.discount_amount || 0).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="btn-primary"
            onClick={() => onNavigate("dashboard")}
          >
            View All Orders
          </button>
          <button className="btn-secondary" onClick={() => onNavigate("home")}>
            Continue Shopping
          </button>
        </div>

        <div className="email-confirmation">
          <p>
            A confirmation email has been sent to your registered email address.
          </p>
          <p>You can track your order from your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
