// src/App.jsx
import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
    // Simple navigation state to switch between views
    const [currentPage, setCurrentPage] = useState('products');

    // Render page based on state
    const renderPage = () => {
        switch (currentPage) {
            case 'login':
                return <LoginPage />;
            case 'products':
                return <ProductsPage />;
            case 'cart':
                return <CartPage />;
            case 'checkout':
                return <CheckoutPage />;
            default:
                return <ProductsPage />;
        }
    };

    return (
        <div className="app-container" style={styles.appWrapper}>
            {/* Navigation Header */}
            <header style={styles.header}>
                <div style={styles.logo} onClick={() => setCurrentPage('products')}>
                    🏡 Home Business Store
                </div>
                <nav style={styles.nav}>
                    <button
                        style={currentPage === 'products' ? styles.activeNavBtn : styles.navBtn}
                        onClick={() => setCurrentPage('products')}
                    >
                        Products
                    </button>
                    <button
                        style={currentPage === 'cart' ? styles.activeNavBtn : styles.navBtn}
                        onClick={() => setCurrentPage('cart')}
                    >
                        Cart
                    </button>
                    <button
                        style={currentPage === 'checkout' ? styles.activeNavBtn : styles.navBtn}
                        onClick={() => setCurrentPage('checkout')}
                    >
                        Checkout
                    </button>
                    <button
                        style={currentPage === 'login' ? styles.activeNavBtn : styles.navBtn}
                        onClick={() => setCurrentPage('login')}
                    >
                        Login
                    </button>
                </nav>
            </header>

            {/* Main Page Area */}
            <main style={styles.mainContent}>{renderPage()}</main>

            {/* Footer */}
            <footer style={styles.footer}>
                <p>&copy; 2026 Home Business Store. All rights reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    appWrapper: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        backgroundColor: '#ffffff',
        padding: '15px 40px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    },
    logo: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#2b3a4a',
        cursor: 'pointer',
    },
    nav: {
        display: 'flex',
        gap: '10px',
    },
    navBtn: {
        padding: '8px 16px',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        color: '#555555',
        fontWeight: '500',
    },
    activeNavBtn: {
        padding: '8px 16px',
        backgroundColor: '#2b3a4a',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.95rem',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    mainContent: {
        flex: '1',
    },
    footer: {
        backgroundColor: '#ffffff',
        padding: '15px',
        textAlign: 'center',
        borderTop: '1px solid #e0e0e0',
        fontSize: '0.85rem',
        color: '#666666',
    },
};

export default App;