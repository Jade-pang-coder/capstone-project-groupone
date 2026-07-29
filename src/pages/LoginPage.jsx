import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "../pages/LoginPage.css";

const LoginPage = ({ onNavigate }) => {
  const { login, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const { t } = useTranslation();

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
      setError(t("auth.emailPasswordRequired"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("auth.passwordLength"));
      return;
    }

    try {
      await login(formData.email, formData.password);
      onNavigate("home");
    } catch (err) {
      setError(err.message || t("auth.loginFailed"));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2>{t("auth.login")}</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{t("auth.email")}</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("auth.enterEmail")}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t("auth.password")}</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t("auth.enterPassword")}
                autoComplete="current-password"
                minLength="8"
                required
              />
            </div>

            <p className="auth-note">
              {t("auth.authNote")}
            </p>

            {error && <div className="error-message">{error}</div>}
            {authError && <div className="error-message">{authError}</div>}

            <button
              type="submit"
              className="btn-primary btn-block"
              disabled={loading}
            >
              {loading ? t("auth.loggingIn") : t("auth.login")}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {t("auth.noAccount")}{" "}
              <button
                className="link-button"
                onClick={() => onNavigate("register")}
              >
                {t("auth.registerHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
