import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../pages/LoginPage.css";

const LoginPage = ({ onNavigate }) => {
  const { login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await login(formData.email, formData.password);
      onNavigate("home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength="8"
                required
              />
            </div>

            <p className="auth-note">
              Password verification requires backend authentication support.
            </p>

            {error && <div className="error-message">{error}</div>}
            {authError && <div className="error-message">{authError}</div>}

            <button
              type="submit"
              className="btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <button
                className="link-button"
                onClick={() => onNavigate("register")}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
