'use client';

import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';
import CartItem from './CartItem';
import { showToast } from '@/lib/cartUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }

    const totalAmount = getTotalPrice();
    
    // Save checkout snapshot
    try {
      const snapshot = {
        items: cartItems.map((it) => ({
          id: it.id,
          name: it.name,
          // ensure price is a number when serializing
          price: typeof it.price === 'number' ? it.price : 0,
          quantity: it.quantity,
          size: it.size || 'regular',
          image: it.image || '',
        })),
        total: totalAmount,
      };
      localStorage.setItem('checkoutData', JSON.stringify(snapshot));
    } catch (e) {
      console.warn('Could not save checkout snapshot', e);
    }

    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[9900]"
          onClick={() => setIsCartOpen(false)}
          aria-label="Close cart"
        />
      )}

      {/* Cart Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-[9999]"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-6 border-b"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-heading font-semibold text-primary-900">
              Your Cart ({cartItems.length})
            </h2>
            <motion.button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.svg 
                  className="w-16 h-16 text-gray-300 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </motion.svg>
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <motion.button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gold-500 hover:text-gold-600 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {cartItems.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <motion.div 
              className="border-t p-6 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {/* Total */}
              <div className="flex items-center justify-between text-xl font-semibold">
                <span>Total:</span>
                <motion.span 
                  className="text-gold-600"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  ₨{getTotalPrice()}
                </motion.span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleCheckout}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Proceed to Order
                </motion.button>
                <motion.button
                  onClick={() => {
                    clearCart();
                    showToast('Cart cleared!');
                  }}
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Clear Cart
                </motion.button>
              </div>

              {/* Contact Info */}
              <div className="text-center text-sm text-gray-500 pt-4 border-t">
                <p>Questions? Call us at:</p>
                <p className="font-semibold text-primary-900">0318-1717763</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}