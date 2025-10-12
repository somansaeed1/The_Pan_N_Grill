/**
 * useDeliveryZone Hook (FREE VERSION)
 * 
 * Custom React hook for easy integration of delivery zone checking
 * Now uses FREE OpenStreetMap APIs instead of paid Google Maps
 * NO API KEY REQUIRED! 🎉
 */

import { useState, useCallback } from 'react';
import {
  getUserLocation,
  getCityFromCoordinates,
  calculateDistance,
  getOrderLimit,
  isDeliveryAvailable,
  RESTAURANT_COORDS,
  OrderLimitRule
} from '@/lib/deliveryZoneUtils';

export interface DeliveryZoneResult {
  userLocation: { lat: number; lng: number } | null;
  cityName: string | null;
  distanceKm: number | null;
  orderRule: OrderLimitRule | null;
  deliveryAllowed: boolean;
  errorMessage: string | null;
  loading: boolean;
}

interface UseDeliveryZoneOptions {
  autoDetect?: boolean;
}

export function useDeliveryZone(options: UseDeliveryZoneOptions = {}) {
  const { autoDetect = false } = options;

  const [result, setResult] = useState<DeliveryZoneResult>({
    userLocation: null,
    cityName: null,
    distanceKm: null,
    orderRule: null,
    deliveryAllowed: false,
    errorMessage: null,
    loading: false
  });

  /**
   * Detect user location and calculate delivery zone (FREE VERSION)
   */
  const detectDeliveryZone = useCallback(async () => {
    setResult(prev => ({ ...prev, loading: true, errorMessage: null }));

    try {
      // Step 1: Get user location
      const userCoords = await getUserLocation();

      // Step 2: Get city name using FREE OpenStreetMap Nominatim API
      let cityName: string | null = null;

      cityName = await getCityFromCoordinates(userCoords.lat, userCoords.lng);

      // Check if delivery is available in this city
      const deliveryAllowed = isDeliveryAvailable(cityName);

      if (!deliveryAllowed) {
        setResult({
          userLocation: userCoords,
          cityName,
          distanceKm: null,
          orderRule: null,
          deliveryAllowed: false,
          errorMessage: "Order can't be placed. We are not delivering at your location.",
          loading: false
        });
        return;
      }

      // Step 3: Calculate distance using FREE Haversine formula
      const distanceKm = calculateDistance(
        userCoords.lat,
        userCoords.lng
      );

      // Step 4: Get order rule
      const orderRule = getOrderLimit(distanceKm);

      // Step 5: Update state
      setResult({
        userLocation: userCoords,
        cityName,
        distanceKm,
        orderRule,
        deliveryAllowed: true,
        errorMessage: null,
        loading: false
      });

      // Return result for immediate use
      return {
        userLocation: userCoords,
        cityName,
        distanceKm,
        orderRule,
        deliveryAllowed: true,
        errorMessage: null
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to detect delivery zone';

      setResult(prev => ({
        ...prev,
        errorMessage,
        loading: false
      }));

      throw error;
    }
  }, []);

  /**
   * Reset delivery zone state
   */
  const reset = useCallback(() => {
    setResult({
      userLocation: null,
      cityName: null,
      distanceKm: null,
      orderRule: null,
      deliveryAllowed: false,
      errorMessage: null,
      loading: false
    });
  }, []);

  /**
   * Check if current order total meets minimum requirement
   */
  const validateOrder = useCallback(
    (orderTotal: number): { valid: boolean; message: string } => {
      if (!result.orderRule) {
        return {
          valid: false,
          message: 'Please detect your location first'
        };
      }

      if (!result.deliveryAllowed) {
        return {
          valid: false,
          message: result.errorMessage || 'Delivery not available'
        };
      }

      const minOrder = result.orderRule.minOrder;

      if (orderTotal < minOrder) {
        return {
          valid: false,
          message: `Minimum order is Rs. ${minOrder}. Current total: Rs. ${orderTotal}`
        };
      }

      return {
        valid: true,
        message: 'Order meets minimum requirement'
      };
    },
    [result]
  );

  return {
    ...result,
    detectDeliveryZone,
    reset,
    validateOrder
  };
}

/**
 * Example Usage:
 * 
 * function CheckoutPage() {
 *   const { 
 *     distanceKm, 
 *     orderRule, 
 *     deliveryAllowed, 
 *     loading, 
 *     detectDeliveryZone,
 *     validateOrder 
 *   } = useDeliveryZone();
 * 
 *   const cartTotal = 1500;
 *   const orderValidation = validateOrder(cartTotal);
 * 
 *   return (
 *     <div>
 *       <button onClick={detectDeliveryZone}>
 *         Detect Location
 *       </button>
 *       {loading && <p>Loading...</p>}
 *       {deliveryAllowed && orderRule && (
 *         <p>Distance: {distanceKm} km | Min Order: Rs. {orderRule.minOrder}</p>
 *       )}
 *       {!orderValidation.valid && (
 *         <p className="error">{orderValidation.message}</p>
 *       )}
 *     </div>
 *   );
 * }
 */
