import { CartItem } from '@/types';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window === 'undefined') return;
  
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast-notification px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl text-white text-sm sm:text-base font-medium text-center max-w-md w-full ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  }`;
  toast.style.wordWrap = 'break-word';
  toast.style.whiteSpace = 'normal';
  toast.style.lineHeight = '1.5';
  toast.textContent = message;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};