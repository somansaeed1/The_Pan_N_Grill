'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import CartItem from './CartItem';
import { useDeliveryZone } from '@/hooks/useDeliveryZone';
import { formatPrice, showToast } from '@/lib/cartUtils';

export default function CartDrawer() {
  const router = useRouter();
  const { cartItems, summary, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { orderRule, hasLocation } = useDeliveryZone();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsCartOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, setIsCartOpen]);

  const minOrder = hasLocation && orderRule ? orderRule.minOrder : 0;
  const shortBy = Math.max(0, minOrder - summary.total);

  const goToCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className={`fixed inset-0 z-[9900] ${isCartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isCartOpen}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsCartOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between bg-primary-600 px-5 py-4 text-white">
          <h2 className="text-2xl uppercase">Your cart ({cartItems.reduce((n, i) => n + i.quantity, 0)})</h2>
          <button onClick={() => setIsCartOpen(false)} className="rounded-full p-2 hover:bg-white/20" aria-label="Close cart">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-2xl uppercase text-primary-900">Your cart is empty</p>
            <p className="text-gray-500">Add something tasty from the menu.</p>
            <button
              className="btn-primary"
              onClick={() => {
                setIsCartOpen(false);
                router.push('/menu');
              }}
            >
              Browse menu
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {cartItems.map((item) => (
                <CartItem key={item.lineId} item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />
              ))}
            </ul>

            <div className="space-y-3 border-t p-4">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Items</dt>
                  <dd>{formatPrice(summary.itemsSubtotal)}</dd>
                </div>
                {summary.addOnsSubtotal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Add-ons</dt>
                    <dd>{formatPrice(summary.addOnsSubtotal)}</dd>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-lg font-bold text-primary-900">
                  <dt>Total</dt>
                  <dd className="text-primary-600">{formatPrice(summary.total)}</dd>
                </div>
              </dl>

              {shortBy > 0 && (
                <p className="rounded-xl bg-gold-400/20 px-3 py-2 text-sm text-primary-900" role="status">
                  Add {formatPrice(shortBy)} more to meet the {formatPrice(minOrder)} minimum for delivery.
                </p>
              )}

              <button onClick={goToCheckout} className="btn-primary w-full">Checkout</button>
              <button
                onClick={() => {
                  clearCart();
                  showToast('Cart cleared');
                }}
                className="w-full py-1 text-sm font-semibold text-gray-500 hover:text-primary-600"
              >
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
