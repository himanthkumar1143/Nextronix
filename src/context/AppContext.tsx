import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, User, Order, CartItem, ShippingAddress, Complaint } from '../types';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type Page = 'home' | 'products' | 'contact' | 'track-orders' | 'my-orders' | 'admin' | 'cart' | 'wishlist' | 'product-details' | 'checkout';

interface AppContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  complaints: Complaint[];
  theme: 'dark' | 'light';
  currentPage: Page;
  selectedProductId: string | null;
  activeCategory: string;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: string;
  inStockOnly: boolean;
  notifications: Notification[];
  isLoading: boolean;
  adminStats: any;
  
  // Handlers
  setPage: (page: Page) => void;
  setActiveCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
  setInStockOnly: (inStockOnly: boolean) => void;
  selectProduct: (id: string | null) => void;
  adminLogin: (email: string, pword: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  toggleWishlist: (productId: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  submitOrder: (details: { name: string; email: string; phoneNumber: string; address: ShippingAddress; paymentMethod: string }) => Promise<Order | null>;
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  
  // New features
  submitComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>) => Promise<boolean>;
  trackOrder: (orderId: string, contact: string) => Promise<Order | null>;
  fetchMyOrders: (contact: string) => Promise<Order[]>;
  
  // Admin Operations
  adminAddProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => Promise<boolean>;
  adminUpdateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  adminDeleteProduct: (id: string) => Promise<boolean>;
  adminUpdateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
  adminDeleteOrder: (id: string) => Promise<boolean>;
  adminFetchComplaints: () => Promise<void>;
  adminUpdateComplaintStatus: (id: string, status: 'pending' | 'resolved') => Promise<boolean>;
  adminDeleteComplaint: (id: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('nextronix_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      localStorage.removeItem('nextronix_admin_user');
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('nextronix_admin_token'));
  const [isAdmin, setIsAdmin] = useState<boolean>(!!token);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nextronix_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      localStorage.removeItem('nextronix_cart');
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nextronix_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      localStorage.removeItem('nextronix_wishlist');
      return [];
    }
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('nextronix_theme');
    return (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) ? 'dark' : 'light';
  });
  
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adminStats, setAdminStats] = useState<any>(null);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
    localStorage.setItem('nextronix_theme', theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('nextronix_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nextronix_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      let url = `/api/products?sort=${sortBy}`;
      if (activeCategory && activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
      if (searchQuery) url += `&q=${encodeURIComponent(searchQuery)}`;
      if (inStockOnly) url += `&inStock=true`;
      if (priceRange[1] < 10000) url += `&maxPrice=${priceRange[1]}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Fetch products error', e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortBy, inStockOnly, priceRange]);

  const fetchAdminStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setAdminStats(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      refreshOrders();
      adminFetchComplaints();
      fetchAdminStats();
    }
  }, [isAdmin, token]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeNotification(id), 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setPage = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectProduct = (id: string | null) => {
    setSelectedProductId(id);
    if (id) setPage('product-details');
  };

  // Admin Auth Logic
  const adminLogin = async (email: string, pword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pword })
      });
      const data = await res.json();
      if (res.ok && data.user.role === 'admin') {
        setUser(data.user);
        setToken(data.token);
        setIsAdmin(true);
        localStorage.setItem('nextronix_admin_token', data.token);
        localStorage.setItem('nextronix_admin_user', JSON.stringify(data.user));
        addNotification(`Admin Access Granted. Welcome, ${data.user.name}.`, 'success');
        return true;
      } else {
        addNotification(data.error || 'Admin credentials authorization failed', 'error');
        return false;
      }
    } catch (e) {
      addNotification('An unexpected network link failure occurred', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('nextronix_admin_token');
    localStorage.removeItem('nextronix_admin_user');
    addNotification('Administrative session concluded', 'info');
    setPage('home');
  };

  const toggleWishlist = (productId: string) => {
    let message = '';
    setWishlist(prev => {
      const inList = prev.includes(productId);
      message = inList ? 'Removed item from Wishlist' : 'Added item to Wishlist';
      return inList ? prev.filter(id => id !== productId) : [...prev, productId];
    });
    // Slight timeout in case of synchronous issues or simply addNotification after
    setTimeout(() => {
      if (message) {
        addNotification(message, 'success');
      }
    }, 0);
  };

  const addToCart = (product: Product, quantity = 1) => {
    let message = '';
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        message = `Cart updated: ${product.name} quantity increased`;
        return updated;
      }
      message = `Added "${product.name}" to your system cart`;
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        imageUrl: product.imageUrl,
        stock: product.stock
      }];
    });
    setTimeout(() => {
      if (message) addNotification(message, 'success');
    }, 0);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addNotification('Component removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const submitOrder = async (details: { name: string; email: string; phoneNumber: string; address: ShippingAddress; paymentMethod: string }): Promise<Order | null> => {
    setIsLoading(true);
    try {
      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: details.name,
          userEmail: details.email,
          phoneNumber: details.phoneNumber,
          items: cart,
          totalAmount: total,
          shippingAddress: details.address,
          paymentMethod: details.paymentMethod
        })
      });
      if (res.ok) {
        const order = await res.json();
        addNotification('Logistics deployment complete. Order confirmed!', 'success');
        clearCart();
        return order;
      }
      addNotification('Checkout sequence failed', 'error');
      return null;
    } catch (e) {
      addNotification('Logistics link error', 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const trackOrder = async (orderId: string, contact: string): Promise<Order | null> => {
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(orderId)}?contact=${encodeURIComponent(contact)}`);
      return res.ok ? await res.json() : null;
    } catch (e) { return null; }
  };

  const fetchMyOrders = async (contact: string): Promise<Order[]> => {
    try {
      const res = await fetch(`/api/orders/my-orders?contact=${encodeURIComponent(contact)}`);
      return res.ok ? await res.json() : [];
    } catch (e) { return []; }
  };

  const submitComplaint = async (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint)
      });
      if (res.ok) {
        addNotification('Protocol anomaly report synchronized.', 'success');
        return true;
      }
      return false;
    } catch (e) { return false; }
  };

  // Admin Operations
  const refreshOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setOrders(await res.json());
    } catch (e) { console.error(e); }
  };

  const adminAddProduct = async (prod: Omit<Product, 'id' | 'createdAt'>) => {
    if (!token) return false;
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(prod)
    });
    if (res.ok) { 
      fetchProducts(); 
      addNotification('Product successfully added to catalog.', 'success');
      return true; 
    }
    addNotification('Failed to add product.', 'error');
    return false;
  };

  const adminUpdateProduct = async (id: string, updates: Partial<Product>) => {
    if (!token) return false;
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates)
    });
    if (res.ok) { 
      fetchProducts(); 
      addNotification('Product successfully updated.', 'success');
      return true; 
    }
    addNotification('Failed to update product.', 'error');
    return false;
  };

  const adminDeleteProduct = async (id: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { 
        await fetchProducts(); 
        addNotification('Product successfully purged from database.', 'success');
        return true; 
      }
      addNotification('Failed to delete product from database.', 'error');
      return false;
    } catch (e) {
      addNotification('Network error during deletion protocol.', 'error');
      return false;
    }
  };

  const adminUpdateOrderStatus = async (id: string, status: Order['status']) => {
    if (!token) return false;
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (res.ok) { 
      refreshOrders(); 
      addNotification(`Order status updated to ${status}.`, 'success');
      return true; 
    }
    addNotification('Failed to update order status.', 'error');
    return false;
  };

  const adminDeleteOrder = async (id: string) => {
    if (!token) return false;
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) { 
      refreshOrders(); 
      addNotification('Order deleted successfully.', 'success');
      return true; 
    }
    addNotification('Failed to delete order.', 'error');
    return false;
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const adminFetchComplaints = async () => {
    if (!token) return;
    const res = await fetch('/api/admin/complaints', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setComplaints(await res.json());
  };

  const adminUpdateComplaintStatus = async (id: string, status: 'pending' | 'resolved') => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) { 
        adminFetchComplaints(); 
        addNotification(`Protocol updated: Complaint ${status}.`, 'success');
        return true; 
      }
      addNotification('Failed to update complaint status.', 'error');
      return false;
    } catch (e) {
      addNotification('Network error during status sync.', 'error');
      return false;
    }
  };

  const adminDeleteComplaint = async (id: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/admin/complaints/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { 
        adminFetchComplaints(); 
        addNotification('Complaint record purged from archives.', 'success');
        return true; 
      }
      addNotification('Failed to purge complaint record.', 'error');
      return false;
    } catch (e) {
      addNotification('Network error during deletion protocol.', 'error');
      return false;
    }
  };



  return (
    <AppContext.Provider value={{
      user, token, isAdmin, products, orders, cart, wishlist, complaints, theme,
      currentPage, selectedProductId, activeCategory, searchQuery, priceRange, sortBy,
      inStockOnly, notifications, isLoading, adminStats, setPage, setActiveCategory, setSearchQuery,
      setSortBy, setInStockOnly, selectProduct, adminLogin, logout, toggleTheme,
      toggleWishlist, addToCart, updateCartQuantity, removeFromCart, clearCart, submitOrder,
      addNotification, removeNotification, refreshProducts, refreshOrders, fetchAdminStats, submitComplaint,
      trackOrder, fetchMyOrders, adminAddProduct, adminUpdateProduct, adminDeleteProduct,
      adminUpdateOrderStatus, adminDeleteOrder, adminFetchComplaints, adminUpdateComplaintStatus, adminDeleteComplaint
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used inside the AppProvider');
  return context;
};
