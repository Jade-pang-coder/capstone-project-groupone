import React, { useState } from 'react';

const CartPage = () => {
    // Sample cart state
    const [cartItems, setCartItems] = useState([
        {
            id: 'ABC-001',
            name: 'Handcrafted Soy Candle',
            price: 29.90,
            quantity: 1,
            image: 'https://via.placeholder.com/80?text=Candle',
        },
        {
            id: 'ABC-002',
            name: 'Ceramic Coffee Mug',
            price: 39.90,
            quantity: 2,
            image: 'https://via.placeholder.com/80?text=Mug',
        },
    ]);

    const updateQuantity = (id, delta) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) => {
                    if (item.id === id) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : item;
                    }
                    return item;
                })
        );
    };

    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Pricing calculations
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const memberDiscount = subtotal * 0.10; // 10% member discount
    const shipping = subtotal > 50 ? 0 : 5.00;
    const finalTotal = subtotal - memberDiscount + shipping;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Your Shopping Cart ({cartItems.length} items)</h2>

            {cartItems.length === 0 ? (
                <p style={styles.emptyText}>Your cart is empty.</p>
            ) : (
                <div style={styles.layout}>
                    {/* Cart Table */}
                    <div style={styles.itemsList}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Product</th>
                                    <th style={styles.th}>Quantity</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id} style={styles.tr}>
                                        <td style={styles.tdProduct}>
                                            <img src={item.image} alt={item.name} style={styles.thumb} />
                                            <div>
                                                <strong>{item.name}</strong>
                                                <div style={styles.sku}>SKU: {item.id}</div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.qtyBox}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    style={styles.qtyBtn}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    style={styles.qtyBtn}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                style={styles.removeBtn}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Summary */}
                    <div style={styles.summaryCard}>
                        <h3 style={styles.summaryTitle}>Order Summary</h3>
                        <div style={styles.summaryRow}>
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Member Discount (10%):</span>
                            <span style={styles.discount}>-${memberDiscount.toFixed(2)}</span>
                        </div>
                        <div style={styles.summaryRow}>
                            <span>Estimated Shipping:</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <hr style={styles.hr} />
                        <div style={styles.totalRow}>
                            <strong>Final Total:</strong>
                            <strong>${finalTotal.toFixed(2)}</strong>
                        </div>

                        <button style={styles.checkoutBtn}>Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '30px 20px',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#2b3a4a',
    },
    emptyText: {
        color: '#666',
        fontSize: '1.1rem',
    },
    layout: {
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap',
    },
    itemsList: {
        flex: '2',
        minWidth: '300px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    th: {
        textAlign: 'left',
        padding: '12px 15px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
    },
    tr: {
        borderBottom: '1px solid #eee',
    },
    td: {
        padding: '12px 15px',
        verticalAlign: 'middle',
    },
    tdProduct: {
        padding: '12px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    thumb: {
        width: '50px',
        height: '50px',
        borderRadius: '4px',
        objectFit: 'cover',
    },
    sku: {
        fontSize: '0.75rem',
        color: '#888',
    },
    qtyBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    qtyBtn: {
        padding: '2px 8px',
        cursor: 'pointer',
    },
    removeBtn: {
        backgroundColor: 'transparent',
        color: '#d9534f',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.85rem',
    },
    summaryCard: {
        flex: '1',
        minWidth: '280px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 'fit-content',
    },
    summaryTitle: {
        marginBottom: '15px',
        fontSize: '1.2rem',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '0.95rem',
    },
    discount: {
        color: '#28a745',
    },
    hr: {
        margin: '15px 0',
        border: 'none',
        borderTop: '1px solid #eee',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    checkoutBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#2b3a4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
    },
};

export default CartPage;