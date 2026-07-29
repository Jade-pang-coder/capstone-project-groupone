import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return (
      <div className="protected-route-error">
        <h2>{t("auth.accessDenied")}</h2>
        <p>{t("auth.loginRequired")}</p>
      </div>
    );
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    return (
      <div className="protected-route-error">
        <h2>{t("auth.accessDenied")}</h2>
        <p>{t("auth.permissionDenied")}</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
