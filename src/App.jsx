import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import GuestOrderLookupPage from "./pages/GuestOrderLookupPage";
import "./App.css";

function App() {
  const { t } = useTranslation();
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
      case "track-order": {
        const orderCode = decodeURIComponent(currentPage.split("/")[1] || "");
        return (
          <GuestOrderLookupPage
            initialOrderCode={orderCode}
            onNavigate={handleNavigate}
          />
        );
      }
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
          <p>{t("footer.copyright")}</p>
          <div className="footer-links">
            <a href="#privacy">{t("footer.privacy")}</a>
            <a href="#terms">{t("footer.terms")}</a>
            <a href="#contact">{t("footer.contact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
