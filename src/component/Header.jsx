import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContent";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const Header = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <h1 className="logo" onClick={() => onNavigate("home")}>
            <img className="logo-image" src="/favicon.png" alt="" />
            <span>{t("common.shopName")}</span>
          </h1>
          <div className="header-actions">
            <ThemeToggle />
            <LanguageSelector />
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  {t("nav.welcome", { name: user?.name || t("common.user") })}
                </span>
                <button
                  className="nav-button"
                  onClick={() => onNavigate("dashboard")}
                >
                  {t("nav.myOrders")}
                </button>
                <button
                  className="nav-button logout-btn"
                  onClick={handleLogout}
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-button"
                  onClick={() => onNavigate("login")}
                >
                  {t("nav.login")}
                </button>
                <button
                  className="nav-button primary"
                  onClick={() => onNavigate("register")}
                >
                  {t("nav.register")}
                </button>
              </>
            )}
            <button
              className="cart-button"
              onClick={() => onNavigate("cart")}
              title={t("nav.goToCart")}
            >
              🛒 {t("nav.cart", { count: getTotalItems() })}
            </button>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-link" onClick={() => onNavigate("home")}>
            {t("nav.home")}
          </button>
          <button className="nav-link" onClick={() => onNavigate("products")}>
            {t("nav.products")}
          </button>
          {!isAuthenticated && (
            <button
              className="nav-link"
              onClick={() => onNavigate("track-order")}
            >
              {t("nav.trackOrder")}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
