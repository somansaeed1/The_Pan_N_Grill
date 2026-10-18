'use client';

import { useState } from 'react';
import { DeliveryInfo } from '@/types';
import { 
  calculateDistance, 
  getOrderLimit, 
  isDeliveryAvailableByDistance,
  isDeliveryAvailable,
  getCityFromCoordinates,
  getUserLocation
} from '@/lib/deliveryZoneUtils';

interface LocationModalProps {
  open: boolean;
  onClose: (decision: DeliveryInfo | null) => void;
}

export default function LocationModal({ open, onClose }: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationData, setLocationData] = useState<{
    lat: number;
    lng: number;
    cityName: string | null;
    distanceKm: number;
    deliveryAllowed: boolean;
    orderRule: any;
  } | null>(null);

  const handleAutoDetect = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Get user location
      const userCoords = await getUserLocation();
      
      // Calculate distance
      const distanceKm = calculateDistance(userCoords.lat, userCoords.lng);
      
      // Check distance-based delivery availability
      const distanceDeliveryAllowed = isDeliveryAvailableByDistance(distanceKm);
      
      // Get city name
      let cityName: string | null = null;
      try {
        cityName = await getCityFromCoordinates(userCoords.lat, userCoords.lng);
      } catch (err) {
        console.warn('Could not get city name:', err);
      }
      
      // Check city-based delivery availability
      const cityDeliveryAllowed = isDeliveryAvailable(cityName);
      
      // Get order rule
      const orderRule = getOrderLimit(distanceKm);
      
      // Overall delivery availability
      const deliveryAllowed = distanceDeliveryAllowed && cityDeliveryAllowed;
      
      // Store location data
      const data = {
        lat: userCoords.lat,
        lng: userCoords.lng,
        cityName,
        distanceKm,
        deliveryAllowed,
        orderRule
      };
      
      setLocationData(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect location');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-lift max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold uppercase text-primary-900 mb-2">Where are you located?</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          We need your location to determine delivery availability and any minimum order requirements.
        </p>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {/* Action Button */}
        <div className="mb-4">
          <button
            onClick={handleAutoDetect}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Getting location...' : 'Use my device location'}
          </button>
        </div>

        {/* Location Detection Results */}
        {locationData && (
          <div className="mb-4 p-4 bg-cream border border-gold-400 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">📍 Location Selected</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">City:</span>
                <span className="ml-1 font-medium">{locationData.cityName || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600">Distance:</span>
                <span className="ml-1 font-medium">{locationData.distanceKm.toFixed(2)} km</span>
              </div>
              <div>
                <span className="text-gray-600">Delivery:</span>
                <span className={`ml-1 font-medium ${locationData.deliveryAllowed ? 'text-green-600' : 'text-red-600'}`}>
                  {locationData.deliveryAllowed ? 'Available' : 'Not Available'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Min Order:</span>
                <span className="ml-1 font-medium">
                  {locationData.orderRule.minOrder === 0 ? 'None' : `Rs. ${locationData.orderRule.minOrder}`}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">{locationData.orderRule.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-4 gap-3 sm:gap-0">
          <button
            onClick={() =>
              onClose({ distanceKm: null, allowed: true, minOrder: 0, message: 'Location not provided' })
            }
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 py-2 min-h-[44px] touch-manipulation order-2 sm:order-1"
          >
            Skip for now
          </button>
          
          {locationData && (
            <button
              onClick={() => {
                const decision: DeliveryInfo = {
                  distanceKm: locationData.distanceKm,
                  allowed: locationData.deliveryAllowed,
                  minOrder: locationData.orderRule.minOrder,
                  message: locationData.orderRule.message,
                };
                // Also save the full location data for the hook to use
                const fullLocationData = {
                  ...decision,
                  lat: locationData.lat,
                  lng: locationData.lng,
                  name: locationData.cityName,
                  orderRule: locationData.orderRule,
                  deliveryAllowed: locationData.deliveryAllowed,
                  hasLocation: true
                };
                if (typeof window !== 'undefined') {
                  localStorage.setItem('panngrill-location', JSON.stringify(fullLocationData));
                }
                onClose(decision);
              }}
              className="btn-primary order-1 sm:order-2"
            >
              Continue with Location
            </button>
          )}
        </div>
      </div>
    </div>
  );
}