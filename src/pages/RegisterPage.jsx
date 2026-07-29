import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import "../pages/RegisterPage.css";

const RegisterPage = ({ onNavigate }) => {
  const { register, loading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(t("auth.fillAll"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    if (formData.password.length < 8) {
      setError(t("auth.passwordLength"));
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      onNavigate("home");
    } catch (err) {
      setError(err.message || t("auth.registrationFailed"));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2>{t("auth.createAccount")}</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">{t("auth.fullName")}</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("auth.enterName")}
                required
              />
            </div>

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
                placeholder={t("auth.passwordHint")}
                autoComplete="new-password"
                minLength="8"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t("auth.confirmPassword")}</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={t("auth.confirmPasswordHint")}
                autoComplete="new-password"
                minLength="8"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {authError && <div className="error-message">{authError}</div>}

            <button
              type="submit"
              className="btn-primary btn-block"
              disabled={loading}
            >
              {loading ? t("auth.creatingAccount") : t("auth.register")}
            </button>
          </form>

          <div className="register-footer">
            <p>
              {t("auth.hasAccount")}{" "}
              <button
                className="link-button"
                onClick={() => onNavigate("login")}
              >
                {t("auth.loginHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
