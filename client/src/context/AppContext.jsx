import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_BASE_URL = 'https://sweetdelights-2jv4.onrender.com/api';

export const AppProvider = ({ children }) => {
  // --- DARK MODE STATE ---
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // --- AUTH STATE ---
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- CART STATE ---
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  // --- CAKES STATE ---
  const [cakes, setCakes] = useState([]);
  const [cakesLoading, setCakesLoading] = useState(false);

  // Headers helper
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch current user profile
  const fetchProfile = async (authToken = token) => {
    if (!authToken) {
      setUser(null);
      setAuthLoading(false);
      return;
    }
    try {
      setAuthLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      } else {
        // Token might be invalid/expired
        logout();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        await syncCartWithBackend(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        await syncCartWithBackend(data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server error. Please try again.' };
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    // Reset cart to empty guest cart
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    localStorage.removeItem('guestCart');
  };

  // --- CART MANAGEMENT ---
  // Load initial cart (local for guest, backend for user)
  const loadCart = async (authToken = token) => {
    if (!authToken) {
      // Guest cart
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      } else {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
      }
      return;
    }

    try {
      setCartLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    } finally {
      setCartLoading(false);
    }
  };

  // Sync guest cart to backend upon login/register
  const syncCartWithBackend = async (authToken) => {
    const guestCartStr = localStorage.getItem('guestCart');
    if (!guestCartStr) {
      await loadCart(authToken);
      return;
    }

    try {
      const guestCart = JSON.parse(guestCartStr);
      // Sequentially upload all guest cart items to the database
      for (const item of guestCart.items) {
        await fetch(`${API_BASE_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            cakeId: item.cakeId._id || item.cakeId,
            quantity: item.quantity,
            subtotal: item.subtotal,
            message: item.message || '',
            weight: item.weight || '1kg',
            selectedFlavor: item.selectedFlavor || 'Standard',
          }),
        });
      }
      // Clear guest cart
      localStorage.removeItem('guestCart');
      await loadCart(authToken);
    } catch (err) {
      console.error('Error syncing cart:', err);
      await loadCart(authToken);
    }
  };

  // Add item to cart
  const addToCart = async (cake, quantity, weight, selectedFlavor, message = '') => {
    // Calculate price multiplier based on weight
    const parsedWeight = parseFloat(weight);
    const multiplier = isNaN(parsedWeight) ? 1 : parsedWeight;
    const subtotal = cake.price * quantity * multiplier;

    if (!token) {
      // Update Guest Cart in Local Storage
      const newItems = [...cart.items];
      const existingIndex = newItems.findIndex(
        (item) =>
          (item.cakeId._id || item.cakeId) === cake._id &&
          item.weight === weight &&
          item.selectedFlavor === selectedFlavor
      );

      if (existingIndex > -1) {
        newItems[existingIndex].quantity += quantity;
        newItems[existingIndex].subtotal += subtotal;
      } else {
        newItems.push({
          cakeId: cake, // Store full object for rendering
          quantity,
          subtotal,
          weight,
          selectedFlavor,
          message,
        });
      }

      const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = newItems.reduce((acc, item) => acc + item.subtotal, 0);
      const updatedCart = { items: newItems, totalItems, totalPrice };

      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return { success: true };
    }

    // User is logged in, sync with DB
    try {
      const res = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          cakeId: cake._id,
          quantity,
          subtotal,
          weight,
          selectedFlavor,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await loadCart();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to add to cart.' };
    }
  };

  // Update item quantity in cart
  const updateCartItem = async (cakeId, quantity, selectedFlavor, weight) => {
    if (quantity <= 0) {
      return removeFromCart(cakeId, selectedFlavor, weight);
    }

    if (!token) {
      // Guest update
      const newItems = cart.items.map((item) => {
        const id = item.cakeId._id || item.cakeId;
        if (id === cakeId && item.selectedFlavor === selectedFlavor && item.weight === weight) {
          const parsedWeight = parseFloat(weight);
          const multiplier = isNaN(parsedWeight) ? 1 : parsedWeight;
          const unitPrice = item.cakeId.price || 0;
          return {
            ...item,
            quantity,
            subtotal: unitPrice * quantity * multiplier,
          };
        }
        return item;
      });

      const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = newItems.reduce((acc, item) => acc + item.subtotal, 0);
      const updatedCart = { items: newItems, totalItems, totalPrice };

      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ cakeId, quantity, selectedFlavor, weight }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to update cart.' };
    }
  };

  // Remove item from cart
  const removeFromCart = async (cakeId, selectedFlavor, weight) => {
    if (!token) {
      // Guest remove
      const newItems = cart.items.filter((item) => {
        const id = item.cakeId._id || item.cakeId;
        return !(id === cakeId && item.selectedFlavor === selectedFlavor && item.weight === weight);
      });

      const totalItems = newItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice = newItems.reduce((acc, item) => acc + item.subtotal, 0);
      const updatedCart = { items: newItems, totalItems, totalPrice };

      setCart(updatedCart);
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ cakeId, selectedFlavor, weight }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.data);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to remove item.' };
    }
  };

  // Clear entire cart
  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    if (!token) {
      localStorage.removeItem('guestCart');
    }
  };

  // --- CAKES CATALOG ACTIONS ---
  const fetchCakes = async () => {
    try {
      setCakesLoading(true);
      const res = await fetch(`${API_BASE_URL}/cakes`);
      const data = await res.json();
      if (data.success) {
        setCakes(data.data);
      }
    } catch (err) {
      console.error('Error fetching cakes:', err);
    } finally {
      setCakesLoading(false);
    }
  };

  // Admin: Create cake
  const createCake = async (cakeData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cakes`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(cakeData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCakes();
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Error adding cake.' };
    }
  };

  // Admin: Update cake
  const updateCake = async (id, cakeData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cakes/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(cakeData),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCakes();
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Error updating cake.' };
    }
  };

  // Admin: Delete cake
  const deleteCake = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/cakes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCakes();
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Error deleting cake.' };
    }
  };

  // --- ORDERS ACTIONS ---

  // Submit new checkout order
  const checkoutOrder = async (orderDetails) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderDetails),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Checkout failed. Please try again.' };
    }
  };

  // Get current customer's orders
  const getMyOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to fetch your orders.' };
    }
  };

  // Admin: Get all orders across platform
  const getAllOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: getHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to load admin orders.' };
    }
  };

  // Admin: Update order delivery / process status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return { success: false, message: 'Failed to update status.' };
    }
  };

  // --- INITIAL BOOTSTRAP ---
  useEffect(() => {
    const bootstrap = async () => {
      if (token) {
        await fetchProfile(token);
      } else {
        setAuthLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  useEffect(() => {
    // Load appropriate cart once auth loading completes
    if (!authLoading) {
      loadCart();
    }
  }, [authLoading]);

  // Load catalog on start
  useEffect(() => {
    fetchCakes();
  }, []);

  return (
    <AppContext.Provider
      value={{
        // Dark Mode
        darkMode,
        toggleDarkMode,

        // Auth
        user,
        token,
        authLoading,
        register,
        login,
        logout,
        fetchProfile,

        // Cart
        cart,
        cartLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,

        // Catalog
        cakes,
        cakesLoading,
        fetchCakes,
        createCake,
        updateCake,
        deleteCake,

        // Orders
        checkoutOrder,
        getMyOrders,
        getAllOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
