import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  getCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../api/cartItemApi";
import { createCart, getCarts } from "../api/cartApi";
import { getProductById } from "../api/productApi";

const CartContext = createContext();

// ── Guest session token ──────────────────────────────────────────────────────
const GUEST_SESSION_KEY = "eshop:guest:session_token";

const getOrCreateGuestToken = () => {
  let token = localStorage.getItem(GUEST_SESSION_KEY);
  if (!token) {
    token = `guest-${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_SESSION_KEY, token);
  }
  return token;
};

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Resolve the server cart ID (authenticated users) ──────────────────────
  const resolveAuthCartId = async () => {
    if (!user?.id) throw new Error("A customer account is required for a server cart");

    const carts = await getCarts(token);
    const existing = carts.find(
      (c) => String(c.user_id) === String(user.id),
    );
    if (existing) return existing.id;

    const newCart = await createCart({ user_id: user.id }, token);
    if (newCart?.id) return newCart.id;

    // Fallback: re-fetch after creation
    const refreshed = await getCarts(token);
    const created = refreshed.find(
      (c) => String(c.user_id) === String(user.id),
    );
    if (!created) throw new Error("Cart was created but could not be retrieved");
    return created.id;
  };

  // ── Resolve guest cart ID (session_token based) ───────────────────────────
  const resolveGuestCartId = async () => {
    const sessionToken = getOrCreateGuestToken();

    const carts = await getCarts(null);
    const existing = carts.find((c) => c.session_token === sessionToken);
    if (existing) return existing.id;

    const newCart = await createCart({ session_token: sessionToken }, null);
    if (newCart?.id) return newCart.id;

    const refreshed = await getCarts(null);
    const created = refreshed.find((c) => c.session_token === sessionToken);
    if (!created) throw new Error("Guest cart could not be created");
    return created.id;
  };

  const resolveCartId = async () =>
    token && user ? resolveAuthCartId() : resolveGuestCartId();

  // ── Hydrate a cart item with product details ───────────────────────────────
  const hydrateCartItem = async (item) => {
    const product = await getProductById(item.product_id);
    return {
      ...product,
      ...item,
      id: item.id,
      product_id: item.product_id,
      name: product.name,
      price: Number(product.price) || 0,
      image_url: product.image_url,
      quantity: Number(item.quantity) || 1,
    };
  };

  // ── Fetch cart from server on auth change ─────────────────────────────────
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  // ── Persist local cart to localStorage ────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const resolvedCartId = await resolveCartId();
      setCartId(resolvedCartId);
      const items = await getCartItems(token, resolvedCartId);
      setCart(await Promise.all(items.map(hydrateCartItem)));
    } catch (err) {
      setError("Failed to fetch cart");
      console.error("Error fetching cart:", err);
      // Fall back to any locally cached cart
      try {
        const saved = localStorage.getItem("cart");
        if (saved) setCart(JSON.parse(saved));
      } catch (_) { /* ignore */ }
    } finally {
      setLoading(false);
    }
  };

  // ── Add to cart ───────────────────────────────────────────────────────────
  const addToCart = async (product, quantity = 1) => {
    try {
      const resolvedCartId = cartId ?? await resolveCartId();
      if (!cartId) setCartId(resolvedCartId);

      const existingItem = cart.find(
        (item) =>
          String(item.product_id) === String(product.id) &&
          String(item.cart_id) === String(resolvedCartId),
      );

      if (existingItem) {
        const nextQuantity = Number(existingItem.quantity) + Number(quantity);
        await updateCartItem(existingItem.id, { quantity: nextQuantity }, token);
        setCart((prev) =>
          prev.map((item) =>
            item.id === existingItem.id ? { ...item, quantity: nextQuantity } : item,
          ),
        );
        return;
      }

      const cartItem = await addCartItem(
        { cart_id: resolvedCartId, product_id: product.id, quantity },
        token,
      );
      setCart((prev) => [
        ...prev,
        {
          ...product,
          ...cartItem,
          id: cartItem.id,
          product_id: product.id,
          cart_id: resolvedCartId,
          name: product.name,
          price: Number(product.price) || 0,
          image_url: product.image_url,
          quantity: Number(cartItem.quantity) || Number(quantity) || 1,
        },
      ]);
    } catch (err) {
      setError("Failed to add to cart");
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  // ── Update cart item quantity ─────────────────────────────────────────────
  const updateCart = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, { quantity }, token);
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: Number(quantity) || 1 } : item,
        ),
      );
    } catch (err) {
      setError("Failed to update cart");
      console.error("Error updating cart:", err);
      throw err;
    }
  };

  // ── Remove cart item ──────────────────────────────────────────────────────
  const removeFromCart = async (itemId) => {
    try {
      await removeCartItem(itemId, token);
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove from cart");
      console.error("Error removing from cart:", err);
      throw err;
    }
  };

  // ── Clear cart ────────────────────────────────────────────────────────────
  const clearCart = async () => {
    const results = await Promise.allSettled(
      cart.map((item) => removeCartItem(item.id, token)),
    );
    if (results.some((r) => r.status === "rejected")) {
      setError("Some cart items could not be removed from the server");
    }
    setCart([]);
  };

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  const getTotalItems = () =>
    cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
