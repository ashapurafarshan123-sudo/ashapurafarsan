import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductWeight, CartItem, GlobalDiscountConfig } from '../types';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, weight: ProductWeight, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  globalDiscount: GlobalDiscountConfig | null;
  formatPrice: (amount: number) => string;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  refreshDiscount: () => Promise<void>;
  hasOutOfStockItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ashapura_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [globalDiscount, setGlobalDiscount] = useState<GlobalDiscountConfig | null>(null);

  // Synchronize cart items with live database prices and active stock states
  useEffect(() => {
    productService.getActiveProducts().then((liveProducts) => {
      if (!liveProducts || liveProducts.length === 0) return;
      setItems((prevItems) => {
        let changed = false;
        const updated = prevItems.map((item) => {
          const liveProd = liveProducts.find(
            (p) => p.id === item.product.id || p.slug === item.product.slug
          );
          if (!liveProd) return item;
          const livePrice = liveProd.prices[item.weight] || item.price;
          const liveActive = liveProd.isActive ?? true;

          if (livePrice !== item.price || liveActive !== item.product.isActive) {
            changed = true;
            return {
              ...item,
              price: livePrice,
              product: {
                ...item.product,
                prices: liveProd.prices,
                isActive: liveActive,
              },
            };
          }
          return item;
        });
        return changed ? updated : prevItems;
      });
    });
  }, []);

  const loadDiscount = useCallback(async () => {
    try {
      const disc = await adminService.getStoreDiscount();
      setGlobalDiscount(disc);
    } catch {
      setGlobalDiscount(null);
    }
  }, []);

  useEffect(() => {
    loadDiscount();
  }, [loadDiscount]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product: Product, weight: ProductWeight, quantity: number = 1) => {
    // Prevent adding out-of-stock products
    if (product.isActive === false) {
      return;
    }
    const pricePerUnit = product.prices[weight] || 0;
    if (pricePerUnit <= 0) {
      return;
    }

    const itemId = `${product.id}-${weight}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prevItems,
          {
            id: itemId,
            product,
            weight,
            quantity,
            price: pricePerUnit,
          },
        ];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Compute Active Global Discount
  let discountAmount = 0;
  if (globalDiscount && globalDiscount.is_active && subtotal > 0) {
    const now = new Date();
    const isStarted = !globalDiscount.start_date || new Date(globalDiscount.start_date) <= now;
    const isNotExpired = !globalDiscount.end_date || new Date(globalDiscount.end_date) >= now;
    const meetsMin = !globalDiscount.min_order_amount || subtotal >= globalDiscount.min_order_amount;

    if (isStarted && isNotExpired && meetsMin) {
      if (globalDiscount.type === 'percentage') {
        const pct = Math.min(100, Math.max(0, globalDiscount.value));
        discountAmount = Math.round((subtotal * pct) / 100);
      } else {
        discountAmount = Math.min(subtotal, Math.max(0, globalDiscount.value));
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasOutOfStockItems = items.some((item) => item.product.isActive === false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        finalTotal,
        globalDiscount,
        formatPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        refreshDiscount: loadDiscount,
        hasOutOfStockItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
