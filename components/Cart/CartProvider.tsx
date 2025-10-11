'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types';
import { showToast, calculateTotal, getTotalItems } from '@/lib/cartUtils';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string, size: string) => void;
  updateQuantity: (itemId: string, size: string, newQuantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('panngrill-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem('panngrill-cart');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('panngrill-cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      showToast('Unable to save cart. Please try again.', 'error');
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id && cartItem.size === item.size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    showToast(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === size))
    );
  };

  const updateQuantity = (itemId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalItemsCount = () => getTotalItems(cartItems);
  const getTotalPrice = () => calculateTotal(cartItems);

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems: getTotalItemsCount,
        getTotalPrice,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};