import React, { useState } from 'react';

// Sample product data
const sampleProducts = [
    {
        id: 'ABC-001',
        name: 'Handcrafted Soy Candle',
        price: 29.90,
        description: '100% natural soy wax with lavender essential oils.',
        image: 'https://via.placeholder.com/200?text=Soy+Candle',
    },
    {
        id: 'ABC-002',
        name: 'Ceramic Coffee Mug',
        price: 39.90,
        description: 'Hand-thrown stoneware mug, microwave and dishwasher safe.',
        image: 'https://via.placeholder.com/200?text=Ceramic+Mug',
    },
    {
        id: 'ABC-003',
        name: 'Organic Herbal Tea Set',
        price: 49.90,
        description: 'Selection of 4 loose-leaf organic tea blends.',
        image: 'https://via.placeholder.com/200?text=Tea+Set',
    },
    {
        id: 'ABC-004',
        name: 'Handmade Linen Apron',
        price: 59.90,
        description: 'Durable washed linen apron with deep front pockets.',
        image: 'https://via.placeholder.com/200?text=Linen+Apron',
    },
];

const ProductsPage = () => {
    const [products] = useState(sampleProducts);

    const handleAddToCart = (product) => {
        alert(`Added "${product.name}" to cart!`);
        // TODO: Connect to global Cart state / Context
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Our Products</h2>
            <div style={styles.grid}>
                {products.map((product) => (
                    <div key={product.id} style={styles.card}>
                        <img
                            src={product.image}
                            alt={product.name}
                            style={styles.image}
                        />
                        <div style={styles.cardContent}>
                            <span style={styles.sku}>SKU: {product.id}</span>
                            <h3 style={styles.productName}>{product.name}</h3>
                            <p style={styles.description}>{product.description}</p>
                            <div style={styles.cardFooter}>
                                <span style={styles.price}>${product.price.toFixed(2)}</span>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    style={styles.addButton}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    image: {
        width: '100%',
        height: '180px',
        objectFit: 'cover',
        backgroundColor: '#eee',
    },
    cardContent: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
    },
    sku: {
        fontSize: '0.75rem',
        color: '#888888',
        marginBottom: '4px',
    },
    productName: {
        fontSize: '1.1rem',
        margin: '0 0 8px 0',
        color: '#333333',
    },
    description: {
        fontSize: '0.85rem',
        color: '#666666',
        flexGrow: 1,
        marginBottom: '15px',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#2b3a4a',
    },
    addButton: {
        padding: '8px 14px',
        backgroundColor: '#2b3a4a',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default ProductsPage;