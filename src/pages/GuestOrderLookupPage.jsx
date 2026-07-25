import { useState } from "react";
import { getOrders } from "../api/orderApi";
import { getOrderItemsByOrderId } from "../api/orderItemApi";
import "./OrderConfirmationPage.css";

const GuestOrderLookupPage = ({ initialOrderCode = "", onNavigate }) => {
  const [orderCode, setOrderCode] = useState(initialOrderCode);
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLookup = async (event) => {
    event.preventDefault();
    const normalizedCode = orderCode.trim().toUpperCase();
    if (!normalizedCode) {
      setError("Enter your order number");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);
    setOrderItems([]);

    try {
      const orders = await getOrders();
      const matchingOrder = orders.find(
        (candidate) =>
          candidate.customer_type === "Guest" &&
          (candidate.order_code?.toUpperCase() === normalizedCode ||
            candidate.order_number?.toUpperCase() === normalizedCode),
      );

      if (!matchingOrder) {
        throw new Error("No order was found with that order number");
      }

      const items = await getOrderItemsByOrderId(matchingOrder.id);
      setOrder(matchingOrder);
      setOrderItems(items);
    } catch (lookupError) {
      setError(lookupError.message || "Unable to retrieve the order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="section">
          <h2>Track Guest Order</h2>
          <p>Enter the order number shown on your checkout confirmation.</p>
          <form onSubmit={handleLookup} className="checkout-form">
            <div className="form-group">
              <label htmlFor="guest-order-code">Order Number</label>
              <input
                id="guest-order-code"
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                placeholder="Example: ORD-2026-005"
                autoComplete="off"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Finding Order..." : "View Order"}
            </button>
          </form>
        </div>

        {order && (
          <div className="order-details">
            <div className="order-info">
              <div className="info-card">
                <h3>Order Number</h3>
                <p className="order-number">
                  #{order.order_number || order.id}
                </p>
              </div>
              <div className="info-card">
                <h3>Status</h3>
                <p className={`status ${order.status}`}>{order.status}</p>
              </div>
              <div className="info-card">
                <h3>Total</h3>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="section">
              <h3>Shipping Information</h3>
              <p>
                <strong>{order.customer_name}</strong>
              </p>
              <p>{order.shipping_address}</p>
            </div>

            <div className="section">
              <h3>Order Items</h3>
              {orderItems.length ? (
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.sku}</td>
                        <td>{item.quantity}</td>
                        <td>${item.line_total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items were found for this order.</p>
              )}
            </div>

            <button
              className="btn-secondary"
              onClick={() => onNavigate("products")}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestOrderLookupPage;
