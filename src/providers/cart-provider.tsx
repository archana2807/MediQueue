"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { CartItem } from "@/types";
import { toast } from "sonner";

const CART_KEY = "examverse-cart";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(getStoredCart());
    setHydrated(true);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.bookId === item.bookId);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: i.quantity + 1 } : i
        );
        toast.success("Updated cart", { description: `"${item.title}" quantity increased.` });
      } else {
        next = [...prev, { ...item, quantity: 1 }];
        toast.success("Added to cart", { description: `"${item.title}" has been added.` });
      }
      storeCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((bookId: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.bookId === bookId);
      const next = prev.filter((i) => i.bookId !== bookId);
      storeCart(next);
      if (removed) {
        toast.success("Removed from cart", { description: `"${removed.title}" removed.` });
      }
      return next;
    });
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const next = prev.map((i) =>
        i.bookId === bookId ? { ...i, quantity } : i
      );
      storeCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    storeCart([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!hydrated) {
    return <CartContext.Provider value={{ items: [], addItem: () => {}, removeItem: () => {}, updateQuantity: () => {}, clearCart: () => {}, total: 0, itemCount: 0 }}>{children}</CartContext.Provider>;
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
