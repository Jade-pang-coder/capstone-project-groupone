import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContent";
import "./Header.css";

const Header = ({ onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <h1 className="logo" onClick={() => onNavigate("home")}>
            🛍️ E-Shop
          </h1>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-greeting">
                  Welcome, {user?.name || "User"}
                </span>
                <button
                  className="nav-button"
                  onClick={() => onNavigate("dashboard")}
                >
                  My Orders
                </button>
                <button
                  className="nav-button logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-button"
                  onClick={() => onNavigate("login")}
                >
                  Login
                </button>
                <button
                  className="nav-button primary"
                  onClick={() => onNavigate("register")}
                >
                  Register
                </button>
              </>
            )}
            <button
              className="cart-button"
              onClick={() => onNavigate("cart")}
              title="Go to Cart"
            >
              🛒 Cart ({getTotalItems()})
            </button>
          </div>
        </div>
        <nav className="header-nav">
          <button className="nav-link" onClick={() => onNavigate("home")}>
            Home
          </button>
          <button className="nav-link" onClick={() => onNavigate("products")}>
            Products
          </button>
          {!isAuthenticated && (
            <button
              className="nav-link"
              onClick={() => onNavigate("track-order")}
            >
              Track Order
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
