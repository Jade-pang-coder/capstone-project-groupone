import { createContext, useContext, useState } from "react";
import { login, register } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const storeSession = (newToken, userData) => {
    localStorage.removeItem("eshop:guest:session_token");
    localStorage.removeItem("eshop:guest:cart_id");
    localStorage.removeItem("cart");
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      const { token: newToken, user: userData } = response;

      storeSession(newToken, userData);

      return userData;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      const { token: newToken, user: registeredUser } = response;

      storeSession(newToken, registeredUser);

      return registeredUser;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
