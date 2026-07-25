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

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resolveCartId = async () => {
    if (!user?.id) {
      throw new Error("A customer account is required for a server cart");
    }

    const carts = await getCarts(token);
    const existingCart = carts.find(
      (candidate) => String(candidate.user_id) === String(user.id),
    );

    if (existingCart) return existingCart.id;

    const newCart = await createCart(
      {
        user_id: user.id,
        session_token: `customer-${user.id}-${crypto.randomUUID()}`,
      },
      token,
    );
    if (newCart?.id) return newCart.id;

    const refreshedCarts = await getCarts(token);
    const createdCart = refreshedCarts.find(
      (candidate) => String(candidate.user_id) === String(user.id),
    );
    if (!createdCart) {
      throw new Error("Cart was created but could not be retrieved");
    }
    return createdCart.id;
  };

  const hydrateCartItem = async (item) => {
    const product = await getProductById(item.product_id);
    return {
      ...product,
      ...item,
      id: item.id,
      product_id: item.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: Number(item.quantity),
    };
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error parsing saved cart:", err);
      }
    }
  }, []);

  // Fetch cart items from API if user is authenticated
  useEffect(() => {
    if (token && user) {
      fetchCart();
    }
  }, [token, user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const cartId = await resolveCartId();
      const items = await getCartItems(token, cartId);
      setCart(await Promise.all(items.map(hydrateCartItem)));
    } catch (err) {
      setError("Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (token) {
        const cartId = await resolveCartId();
        const existingItem = cart.find(
          (item) =>
            String(item.product_id) === String(product.id) &&
            String(item.cart_id) === String(cartId),
        );

        if (existingItem) {
          const nextQuantity =
            Number(existingItem.quantity) + Number(quantity);
          await updateCartItem(
            existingItem.id,
            { quantity: nextQuantity },
            token,
          );
          setCart((currentCart) =>
            currentCart.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: nextQuantity }
                : item,
            ),
          );
          return;
        }

        const cartItem = await addCartItem(
          {
            cart_id: cartId,
            product_id: product.id,
            quantity,
          },
          token,
        );
        setCart((currentCart) => [
          ...currentCart,
          {
            ...product,
            ...cartItem,
            id: cartItem.id,
            product_id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: Number(cartItem.quantity),
          },
        ]);
      } else {
        // Add to local cart (guest user)
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
          updateLocalCartItem(product.id, existingItem.quantity + quantity);
        } else {
          setCart([
            ...cart,
            {
              id: product.id,
              ...product,
              quantity,
            },
          ]);
        }
      }
    } catch (err) {
      setError("Failed to add to cart");
      console.error("Error adding to cart:", err);
      throw err;
    }
  };

  const updateLocalCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const updateCart = async (itemId, quantity) => {
    try {
      if (token) {
        // Update in backend
        await updateCartItem(itemId, { quantity }, token);
        setCart(
          cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        );
      } else {
        // Update local cart
        updateLocalCartItem(itemId, quantity);
      }
    } catch (err) {
      setError("Failed to update cart");
      console.error("Error updating cart:", err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (token) {
        // Remove from backend
        await removeCartItem(itemId, token);
        setCart(cart.filter((item) => item.id !== itemId));
      } else {
        // Remove from local cart
        setCart(cart.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      setError("Failed to remove from cart");
      console.error("Error removing from cart:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    if (token) {
      const results = await Promise.allSettled(
        cart.map((item) => removeCartItem(item.id, token)),
      );
      if (results.some((result) => result.status === "rejected")) {
        setError("Order placed, but some server cart items could not be removed");
      }
    }
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0,
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

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
