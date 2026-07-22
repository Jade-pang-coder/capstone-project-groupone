import React, { useState } from 'react';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: '',
    });

    const [orderComplete, setOrderComplete] = useState(false);
    const [orderId, setOrderId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Generate fake order ID
        const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderId(generatedId);
        setOrderComplete(true);

        // TODO: Send order data to Express API endpoint (`POST /api/orders`)
    };

    if (orderComplete) {
        return (
            <div style={styles.container}>
                <div style={styles.successCard}>
                    <h2>Thank you for your order!</h2>
                    <p>Your order has been placed successfully.</p>
                    <p style={styles.orderId}>Order ID: <strong>{orderId}</strong></p>
                    <p style={styles.emailNote}>
                        A confirmation email has been sent to <strong>{formData.email}</strong>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Checkout</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Contact Info */}
                <section style={styles.section}>
                    <h3>1. Contact Information</h3>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.fieldRow}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* Shipping Address */}
                <section style={styles.section}>
                    <h3>2. Delivery Address</h3>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.fieldRow}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>Postal Code</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
                </section>

                <button type="submit" style={styles.placeOrderBtn}>
                    Place Order
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '30px 20px',
    },
    title: {
        fontSize: '1.8rem',
        marginBottom: '20px',
        color: '#2b3a4a',
    },
    form: {
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    section: {
        marginBottom: '25px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        marginBottom: '15px',
        flex: 1,
    },
    fieldRow: {
        display: 'flex',
        gap: '15px',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    placeOrderBtn: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#28a745',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    successCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    orderId: {
        fontSize: '1.2rem',
        margin: '15px 0',
    },
    emailNote: {
        color: '#666',
    },
};

export default CheckoutPage;