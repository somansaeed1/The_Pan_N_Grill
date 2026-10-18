import { AddOn, CartItem } from '@/types';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  title?: string;
  action?: { label: string; onClick: () => void };
}

export const TOAST_EVENT = 'pan-toast';

/** Shows a toast. Rendered by <ToastContainer /> in the layout. */
export const showToast = (message: string, type: ToastType = 'success', options: ToastOptions = {}) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, type, ...options } }));
};

export const makeLineId = (id: string, size: string, addOns: AddOn[]): string =>
  [id, size, ...addOns.map((a) => a.id).sort()].join('|');

const addOnsPerUnit = (item: CartItem): number => item.addOns.reduce((sum, a) => sum + a.price, 0);

export const unitPrice = (item: CartItem): number => item.price + addOnsPerUnit(item);

export const lineTotal = (item: CartItem): number => unitPrice(item) * item.quantity;

export const getTotalItems = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

export interface CartSummary {
  itemsSubtotal: number;
  addOnsSubtotal: number;
  total: number;
}

export const summarize = (items: CartItem[]): CartSummary => {
  const itemsSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const addOnsSubtotal = items.reduce((sum, i) => sum + addOnsPerUnit(i) * i.quantity, 0);
  return { itemsSubtotal, addOnsSubtotal, total: itemsSubtotal + addOnsSubtotal };
};

export const formatPrice = (amount: number): string => `Rs ${amount.toLocaleString('en-PK')}`;
