import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="protected-route-error">
        <h2>Access Denied</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (requiredRole === "admin" && user?.role !== "admin") {
    return (
      <div className="protected-route-error">
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
