'use client';

/**
 * Enhanced Checkout Page with Delivery Zone Validation
 * 
 * This example shows how to integrate the delivery zone checker
 * into your checkout flow.
 */

import { useState } from 'react';
import { useDeliveryZone } from '@/hooks/useDeliveryZone';
import { useCart } from '@/components/Cart/CartProvider';

export default function EnhancedCheckoutExample() {
  const { cartItems, getTotalPrice } = useCart();
  const {
    distanceKm,
    orderRule,
    deliveryAllowed,
    loading,
    errorMessage,
    cityName,
    detectDeliveryZone,
    validateOrder,
    reset
  } = useDeliveryZone();

  const [locationDetected, setLocationDetected] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'Cash on Delivery'
  });

  const cartTotal = getTotalPrice();

  /**
   * Handle location detection
   */
  const handleDetectLocation = async () => {
    try {
      await detectDeliveryZone();
      setLocationDetected(true);
    } catch (error) {
      console.error('Location detection failed:', error);
    }
  };

  /**
   * Validate and submit order
   */
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if location is detected
    if (!locationDetected || !deliveryAllowed) {
      alert('Please detect your location first to proceed with checkout.');
      return;
    }

    // Validate order total against minimum requirement
    const orderValidation = validateOrder(cartTotal);

    if (!orderValidation.valid) {
      alert(orderValidation.message);
      return;
    }

    // Proceed with order submission
    console.log('Order submitted:', {
      formData,
      cartTotal,
      distanceKm,
      minOrder: orderRule?.minOrder
    });

    alert('Order placed successfully! 🎉');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Checkout
        </h1>

        {/* Step 1: Delivery Zone Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Step 1: Check Delivery Zone
          </h2>

          {!locationDetected ? (
            <div>
              <p className="text-gray-600 mb-4">
                First, let's check if we deliver to your location and determine any minimum order requirements.
              </p>
              <button
                onClick={handleDetectLocation}
                disabled={loading}
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading ? '🔄 Detecting...' : '📍 Detect My Location'}
              </button>
            </div>
          ) : (
            <div>
              {/* Error Message */}
              {errorMessage && !deliveryAllowed && (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg mb-4">
                  <p className="text-red-700 font-medium">{errorMessage}</p>
                  <button
                    onClick={reset}
                    className="mt-3 text-sm text-red-600 underline"
                  >
                    Try Different Location
                  </button>
                </div>
              )}

              {/* Success - Show Delivery Info */}
              {deliveryAllowed && orderRule && (
                <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">📍 City</p>
                      <p className="text-lg font-bold text-gray-800">
                        {cityName || 'Location Detected'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">📏 Distance</p>
                      <p className="text-lg font-bold text-blue-600">
                        {distanceKm} km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{orderRule.emoji} Min Order</p>
                      <p className="text-lg font-bold text-orange-600">
                        {orderRule.minOrder === 0 ? 'None' : `Rs. ${orderRule.minOrder}`}
                      </p>
                    </div>
                  </div>

                  {/* Order Total Validation */}
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Your Cart Total:</span>
                      <span className="text-2xl font-bold text-gray-800">Rs. {cartTotal}</span>
                    </div>

                    {orderRule.minOrder > 0 && (
                      <div className="mt-2">
                        {cartTotal >= orderRule.minOrder ? (
                          <p className="text-green-600 font-medium">
                            ✅ Your order meets the minimum requirement!
                          </p>
                        ) : (
                          <p className="text-red-600 font-medium">
                            ⚠️ Add Rs. {orderRule.minOrder - cartTotal} more to meet the minimum order requirement.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={reset}
                    className="mt-3 text-sm text-green-700 underline"
                  >
                    Change Location
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Order Form (only show if delivery is allowed) */}
        {deliveryAllowed && (
          <form onSubmit={handleSubmitOrder} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Step 2: Delivery Information
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+92 300 1234567"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="House #, Street, Area"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !deliveryAllowed ||
                  (orderRule !== null && cartTotal < orderRule.minOrder)
                }
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-lg hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderRule !== null && cartTotal < orderRule.minOrder
                  ? `Add Rs. ${orderRule.minOrder - cartTotal} More to Continue`
                  : `Place Order - Rs. ${cartTotal}`}
              </button>
            </div>
          </form>
        )}

        {/* Helper Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>💡 Developer Note:</strong> This example shows how to integrate 
            the <code className="bg-blue-100 px-1 rounded">useDeliveryZone</code> hook 
            into your checkout flow. The hook provides location detection, distance calculation, 
            and order validation.
          </p>
        </div>
      </div>
    </div>
  );
}
