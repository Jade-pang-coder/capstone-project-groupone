// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContent";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
