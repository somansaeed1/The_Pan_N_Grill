import { AddOn, CartItem } from '@/types';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window === 'undefined') return;

  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast-notification px-4 py-3 rounded-xl shadow-lift text-white text-sm sm:text-base font-semibold text-center max-w-md w-full ${
    type === 'success' ? 'bg-secondary-600' : 'bg-primary-600'
  }`;
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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
