import React, { createContext, useContext, useState, useEffect } from 'react';
import { COMPLETE_SHOES, SOLE_EDITIONS, REFIT_ADAPTER, BUSINESS_MODEL, SUSTAINABILITY_METRICS } from '../data/mockData';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Shopping Cart State
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('loopstep_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recycleDiscountActive, setRecycleDiscountActive] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  // Saved Custom Designs
  const [savedDesigns, setSavedDesigns] = useState(() => {
    try {
      const saved = localStorage.getItem('loopstep_saved_designs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Placed Orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('loopstep_orders');
      return saved ? JSON.parse(saved) : [
        {
          id: 'ORD-98241',
          date: '2026-10-24',
          customer: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          items: [{ name: 'LoopStep Terra (EU 42)', quantity: 1, price: 2499 }],
          total: 2499,
          status: 'Shipped',
          tracking: 'LS-IND-782194'
        }
      ];
    } catch {
      return [];
    }
  });

  // Customer Inquiries
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('loopstep_inquiries');
      return saved ? JSON.parse(saved) : [
        {
          id: 'INQ-101',
          name: 'Priya Patel',
          email: 'priya.p@impactfunds.org',
          type: 'Investor Inquiry',
          message: 'Interested in seed round participation for circular footwear tooling.',
          date: '2026-10-25'
        }
      ];
    } catch {
      return [];
    }
  });

  // Dynamic Catalog Prices (Managed via Admin)
  const [customPrices, setCustomPrices] = useState(() => {
    try {
      const saved = localStorage.getItem('loopstep_prices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('loopstep_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('loopstep_saved_designs', JSON.stringify(savedDesigns));
  }, [savedDesigns]);

  useEffect(() => {
    localStorage.setItem('loopstep_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('loopstep_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('loopstep_prices', JSON.stringify(customPrices));
  }, [customPrices]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.size === product.size && item.edition === product.edition && item.color === product.color
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += product.quantity || 1;
        return next;
      }
      return [...prev, { ...product, quantity: product.quantity || 1, cartItemId: `${product.id}_${Date.now()}` }];
    });
    showToast(`Added ${product.name} to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  // Subtotal Calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const recycleDiscount = recycleDiscountActive ? Math.round(subtotal * 0.1) : 0;
  const promoDiscount = appliedPromo === 'LOOP15' ? Math.round(subtotal * 0.15) : 0;
  const total = Math.max(0, subtotal - recycleDiscount - promoDiscount);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Customizer design saving
  const saveDesign = (design) => {
    const newDesign = { ...design, id: `DSG-${Date.now()}`, savedAt: new Date().toLocaleDateString() };
    setSavedDesigns((prev) => [newDesign, ...prev]);
    showToast('Sole configuration saved to your profile!');
  };

  const deleteDesign = (id) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
    showToast('Saved design removed', 'info');
  };

  // Place Order Simulation
  const placeOrder = (customerDetails) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      customer: customerDetails.name,
      email: customerDetails.email,
      address: customerDetails.address,
      items: [...cart],
      subtotal,
      discount: recycleDiscount + promoDiscount,
      total,
      paymentMethod: customerDetails.paymentMethod,
      status: 'Confirmed & Processing',
      tracking: `LS-IND-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Submit Contact / Investor Inquiry
  const submitInquiry = (inquiryData) => {
    const newInq = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      ...inquiryData
    };
    setInquiries((prev) => [newInq, ...prev]);
    showToast('Message transmitted to LoopStep engineering team!');
  };

  // Admin Price Update
  const updateProductPrice = (productId, price) => {
    setCustomPrices((prev) => ({ ...prev, [productId]: Number(price) }));
    showToast('Catalog price updated in live store!');
  };

  return (
    <StoreContext.Provider
      value={{
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        recycleDiscountActive,
        setRecycleDiscountActive,
        recycleDiscount,
        promoCode,
        setPromoCode,
        appliedPromo,
        setAppliedPromo,
        promoDiscount,
        total,
        totalCartCount,
        isCartOpen,
        setIsCartOpen,
        savedDesigns,
        saveDesign,
        deleteDesign,
        orders,
        placeOrder,
        inquiries,
        submitInquiry,
        customPrices,
        updateProductPrice,
        toast,
        showToast
      }}
    >
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? 'var(--signal-red)' : toast.type === 'info' ? '#1e293b' : 'var(--bg-card)',
            color: toast.type === 'error' ? '#fff' : 'var(--primary)',
            border: '1px solid var(--border-active)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span>●</span>
          <span style={{ color: 'var(--text-main)' }}>{toast.message}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
