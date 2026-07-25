import { useState } from "react";
import Header from "./component/Header";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    const basePage = currentPage.split("/")[0];

    switch (basePage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "products":
        return <ProductsPage onNavigate={handleNavigate} />;
      case "product": {
        const productId = currentPage.split("/")[1];
        return (
          <ProductDetailsPage
            productId={productId}
            onNavigate={handleNavigate}
          />
        );
      }
      case "cart":
        return <CartPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "checkout":
        return <CheckoutPage onNavigate={handleNavigate} />;
      case "order-confirmation": {
        const orderId = currentPage.split("/")[1];
        return (
          <OrderConfirmationPage
            orderId={orderId}
            onNavigate={handleNavigate}
          />
        );
      }
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app">
      <Header onNavigate={handleNavigate} />
      <main className="main-app">{renderPage()}</main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 E-Shop. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
