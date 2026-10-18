'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, ReactNode } from 'react';
import { AddOn, CartItem } from '@/types';
import { CartSummary, getTotalItems, makeLineId, showToast, summarize } from '@/lib/cartUtils';
import { MAX_LINE_QUANTITY } from '@/lib/catalog';

const STORAGE_KEY = 'panngrill-cart-v2';
const LEGACY_STORAGE_KEY = 'panngrill-cart';

export interface AddToCartInput {
  id: string;
  name: string;
  price: number;
  size: string;
  addOns?: AddOn[];
  image?: string;
}

type Action =
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'add'; item: AddToCartInput }
  | { type: 'setQuantity'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string }
  | { type: 'clear' };

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items;
    case 'add': {
      const addOns = action.item.addOns ?? [];
      const lineId = makeLineId(action.item.id, action.item.size, addOns);
      const existing = items.find((i) => i.lineId === lineId);
      if (existing) {
        return items.map((i) =>
          i.lineId === lineId ? { ...i, quantity: Math.min(i.quantity + 1, MAX_LINE_QUANTITY) } : i
        );
      }
      return [...items, { ...action.item, addOns, lineId, quantity: 1 }];
    }
    case 'setQuantity':
      if (action.quantity <= 0) return items.filter((i) => i.lineId !== action.lineId);
      return items.map((i) =>
        i.lineId === action.lineId ? { ...i, quantity: Math.min(action.quantity, MAX_LINE_QUANTITY) } : i
      );
    case 'remove':
      return items.filter((i) => i.lineId !== action.lineId);
    case 'clear':
      return [];
  }
}

/** Accepts saved carts from both the current and the pre-add-on format. */
function parseSavedCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter((i) => i && typeof i.id === 'string' && Number(i.price) >= 0 && Number(i.quantity) > 0)
    .map((i) => {
      const addOns: AddOn[] = Array.isArray(i.addOns) ? i.addOns : [];
      const size = i.size || 'regular';
      return {
        id: i.id,
        name: String(i.name),
        price: Number(i.price),
        size,
        addOns,
        quantity: Math.min(Number(i.quantity), MAX_LINE_QUANTITY),
        image: i.image,
        lineId: makeLineId(i.id, size, addOns),
      };
    });
}

interface CartContextType {
  cartItems: CartItem[];
  summary: CartSummary;
  addToCart: (item: AddToCartInput) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  /** False until the saved cart has been read from the browser. */
  isReady: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, dispatch] = useReducer(reducer, []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
      dispatch({ type: 'hydrate', items: parseSavedCart(saved) });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      showToast('Your cart could not be saved on this device, so it may be empty if you reload. Check that private browsing is off.', 'error', { title: 'Cart not saved' });
    }
  }, [cartItems, hydrated]);

  const itemsRef = useRef(cartItems);
  itemsRef.current = cartItems;

  const addToCart = useCallback((item: AddToCartInput) => {
    const addOns = item.addOns ?? [];
    const existing = itemsRef.current.find((i) => i.lineId === makeLineId(item.id, item.size, addOns));

    if (existing && existing.quantity >= MAX_LINE_QUANTITY) {
      showToast(`You can order up to ${MAX_LINE_QUANTITY} of the same item online. Call us for larger orders.`, 'error', {
        title: `Limit reached for ${item.name}`,
      });
      return;
    }

    dispatch({ type: 'add', item });

    const details = [item.size !== 'regular' ? item.size : '', ...addOns.map((a) => a.name)].filter(Boolean).join(', ');
    const label = details ? `${item.name} (${details})` : item.name;
    showToast(existing ? `${label} quantity is now ${existing.quantity + 1}.` : `${label} is in your cart.`, 'success', {
      title: 'Added to cart',
      action: { label: 'View cart', onClick: () => setIsCartOpen(true) },
    });
  }, []);
  const removeFromCart = useCallback((lineId: string) => dispatch({ type: 'remove', lineId }), []);
  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => dispatch({ type: 'setQuantity', lineId, quantity }),
    []
  );
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo<CartContextType>(() => {
    const summary = summarize(cartItems);
    return {
      cartItems,
      summary,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems: () => getTotalItems(cartItems),
      getTotalPrice: () => summary.total,
      isReady: hydrated,
      isCartOpen,
      setIsCartOpen,
    };
  }, [cartItems, hydrated, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
