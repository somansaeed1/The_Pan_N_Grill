'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TOAST_EVENT, ToastOptions, ToastType } from '@/lib/cartUtils';

interface ToastItem extends ToastOptions {
  id: number;
  type: ToastType;
  message: string;
}

const MAX_VISIBLE = 3;
const DURATION: Record<ToastType, number> = { success: 4000, info: 4000, error: 7000 };

const STYLES: Record<ToastType, { bar: string; icon: string; path: string }> = {
  success: { bar: 'border-secondary-600', icon: 'bg-secondary-100 text-secondary-700', path: 'M5 13l4 4L19 7' },
  error: { bar: 'border-primary-600', icon: 'bg-primary-50 text-primary-600', path: 'M6 18L18 6M6 6l12 12' },
  info: { bar: 'border-gold-500', icon: 'bg-gold-400/20 text-gold-600', path: 'M12 8v5m0 3h.01' },
};

function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const style = STYLES[toast.type];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => onDismiss(toast.id), DURATION[toast.type]);
    return () => clearTimeout(timer);
  }, [paused, toast.id, toast.type, onDismiss]);

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-lg border-l-4 bg-white p-3 shadow-lift transition duration-300 ${style.bar} ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${style.icon}`}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={style.path} />
        </svg>
      </span>

      <div className="min-w-0 flex-1 text-sm">
        {toast.title && <p className="font-bold uppercase tracking-wide text-primary-900">{toast.title}</p>}
        <p className="text-gray-700">{toast.message}</p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              onDismiss(toast.id);
            }}
            className="mt-1 font-bold uppercase text-primary-600 hover:underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button onClick={() => onDismiss(toast.id)} className="-mr-1 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Dismiss notification">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<Omit<ToastItem, 'id'>>).detail;
      setToasts((prev) => {
        // Replace an identical toast instead of stacking duplicates.
        const rest = prev.filter((t) => !(t.message === detail.message && t.title === detail.title));
        return [...rest, { ...detail, id: nextId.current++ }].slice(-MAX_VISIBLE);
      });
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => window.removeEventListener(TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[10001] mx-auto flex w-full max-w-sm flex-col gap-2 px-4 sm:left-auto sm:right-4 sm:mx-0 sm:px-0">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}
