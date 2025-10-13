'use client';

/**
 * CheckDeliveryZone Component (FREE VERSION)
 * 
 * Uses FREE OpenStreetMap APIs instead of paid Google Maps:
 * - OpenStreetMap Nominatim for reverse geocoding (city detection)
 * - Haversine formula for distance calculation (pure math)
 * - Optional Leaflet.js for map display (open-source)
 * 
 * NO API KEY REQUIRED! 🎉
 */

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  RESTAURANT_COORDS,
  DELIVERY_CITY,
  calculateDistance,
  getCityFromCoordinates,
  getOrderLimit,
  isDeliveryAvailable,
  getUserLocation
} from '@/lib/deliveryZoneUtils';

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-xl flex items-center justify-center">Loading map...</div>
});

export default function CheckDeliveryZone() {
  // State management
  const [loading, setLoading] = useState(false);
  const [zoneData, setZoneData] = useState({
    userLocation: null,
    cityName: null,
    distanceKm: null,
    orderRule: null,
    deliveryAllowed: false,
    errorMessage: null
  });
  const [showMap, setShowMap] = useState(true);

  /**
   * Main function to detect user location and calculate delivery zone
   */
  const detectLocation = useCallback(async () => {
    setLoading(true);
    setZoneData({
      userLocation: null,
      cityName: null,
      distanceKm: null,
      orderRule: null,
      deliveryAllowed: false,
      errorMessage: null
    });

    try {
      // Step 1: Get user's current location using browser Geolocation API
      console.log('📍 Getting user location...');
      const userCoords = await getUserLocation();
      
      console.log('✅ User location:', userCoords);
      setZoneData(prev => ({
        ...prev,
        userLocation: userCoords
      }));

      // Step 2: Get city name using FREE OpenStreetMap Nominatim API
      console.log('🌍 Fetching city name from OpenStreetMap...');
      const cityName = await getCityFromCoordinates(
        userCoords.lat,
        userCoords.lng
      );
      
      console.log('✅ City detected:', cityName);
      setZoneData(prev => ({
        ...prev,
        cityName
      }));

      // Step 3: Check if city is within delivery zone
      const deliveryAllowed = isDeliveryAvailable(cityName);

      if (!deliveryAllowed) {
        console.log('❌ City not in delivery zone');
        setZoneData(prev => ({
          ...prev,
          deliveryAllowed: false,
          errorMessage: `❌ Order can't be placed. We are not delivering at your location. We currently only deliver in ${DELIVERY_CITY}.`
        }));
        setLoading(false);
        return;
      }

      // Step 4: Calculate distance using Haversine formula (FREE - no API)
      console.log('📏 Calculating distance using Haversine formula...');
      const distanceKm = calculateDistance(
        userCoords.lat,
        userCoords.lng
      );

      console.log('✅ Distance calculated:', distanceKm, 'km');

      // Step 5: Get order limit rule based on distance
      const orderRule = getOrderLimit(distanceKm);

      // Step 6: Update state with complete data
      setZoneData({
        userLocation: userCoords,
        cityName,
        distanceKm,
        orderRule,
        deliveryAllowed: true,
        errorMessage: null
      });

      console.log('✅ Delivery zone check complete:', {
        city: cityName,
        distance: distanceKm,
        minOrder: orderRule.minOrder
      });

    } catch (error) {
      console.error('❌ Error detecting location:', error);
      setZoneData(prev => ({
        ...prev,
        errorMessage: error instanceof Error ? error.message : 'Failed to detect location'
      }));
    } finally {
      setLoading(false);
    }
  }, []);


  /**
   * Clear/reset function
   */
  const resetZone = () => {
    setZoneData({
      userLocation: null,
      cityName: null,
      distanceKm: null,
      orderRule: null,
      deliveryAllowed: false,
      errorMessage: null
    });
  };

  // Manual coordinate input fallback (useful if geolocation is denied)
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const handleManualCheck = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setZoneData(prev => ({ ...prev, errorMessage: 'Please enter valid latitude and longitude values.' }));
      return;
    }

    setLoading(true);
    try {
      const cityName = await getCityFromCoordinates(lat, lng);
      if (!cityName) {
        setZoneData({
          userLocation: { lat, lng },
          cityName: null,
          distanceKm: null,
          orderRule: null,
          deliveryAllowed: false,
          errorMessage: `Could not determine your city from the provided coordinates. Please verify the coordinates or try again.`
        });
        return;
      }

      const distanceKm = calculateDistance(lat, lng);
      const orderRule = getOrderLimit(distanceKm);

      setZoneData({
        userLocation: { lat, lng },
        cityName,
        distanceKm,
        orderRule,
        deliveryAllowed: isDeliveryAvailable(cityName),
        errorMessage: null
      });
    } catch (err) {
      setZoneData(prev => ({ ...prev, errorMessage: err instanceof Error ? err.message : 'Manual coordinate check failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🚚 Check Delivery Zone
        </h2>
        <p className="text-gray-600">
          Find out if we deliver to your location and check minimum order requirements
        </p>
        <div className="mt-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ <strong>FREE Service:</strong> Using OpenStreetMap (no API key required!)
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={detectLocation}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg shadow-md hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>Detect My Location</span>
            </>
          )}
        </button>

        {zoneData.userLocation && (
          <button
            onClick={resetZone}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-all"
          >
            🔄 Reset
          </button>
        )}

        {zoneData.userLocation && (
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition-all"
          >
            {showMap ? '🗺️ Hide Map' : '🗺️ Show Map'}
          </button>
        )}
      </div>

      {/* Results Display */}
      {zoneData.errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="text-red-700 font-medium text-lg">
            {zoneData.errorMessage}
          </p>
        </div>
      )}

      {/* Manual coordinates fallback */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 mb-2">If 'Detect My Location' doesn't work, you can enter your coordinates manually (latitude and longitude):</p>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Latitude (e.g. 31.277761)"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            className="px-3 py-2 border rounded-lg w-48"
          />
          <input
            type="text"
            placeholder="Longitude (e.g. 72.321373)"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            className="px-3 py-2 border rounded-lg w-48"
          />
          <button
            onClick={handleManualCheck}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 disabled:opacity-50"
          >
            Check Coordinates
          </button>
        </div>
      </div>

      {zoneData.deliveryAllowed && zoneData.orderRule && (
        <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            {zoneData.cityName && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">📍 Your City</div>
                <div className="text-xl font-bold text-gray-800">
                  {zoneData.cityName}
                </div>
              </div>
            )}

            {/* Distance */}
            {zoneData.distanceKm !== null && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 mb-1">📏 Distance</div>
                <div className="text-xl font-bold text-blue-600">
                  {zoneData.distanceKm.toFixed(2)} km
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  from The Pan N Grill
                </div>
              </div>
            )}

            {/* Order Limit */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 mb-1">
                {zoneData.orderRule.emoji} Order Requirement
              </div>
              <div className={`text-xl font-bold ${
                zoneData.orderRule.minOrder === 0 
                  ? 'text-green-600' 
                  : 'text-orange-600'
              }`}>
                {zoneData.orderRule.minOrder === 0 
                  ? 'No Minimum' 
                  : `Rs. ${zoneData.orderRule.minOrder}`}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {zoneData.orderRule.message}
              </div>
            </div>
          </div>

          {/* Coordinates Info */}
          {zoneData.userLocation && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Your coordinates:</strong> {zoneData.userLocation.lat.toFixed(6)}, {zoneData.userLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Restaurant coordinates:</strong> {RESTAURANT_COORDS.lat}, {RESTAURANT_COORDS.lng}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Leaflet Map Display (Open Source Alternative to Google Maps) */}
      {showMap && zoneData.userLocation && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🗺️ Location Map</span>
            <span className="text-sm font-normal text-green-600">(powered by OpenStreetMap)</span>
          </h3>
          <LeafletMap
            userLocation={zoneData.userLocation}
            restaurantLocation={RESTAURANT_COORDS}
            distance={zoneData.distanceKm}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">📋 Delivery Rules:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ <strong>0-3 km:</strong> No minimum order</li>
          <li>✅ <strong>3-5 km:</strong> No minimum order</li>
          <li>⚠️ <strong>5-10 km:</strong> Minimum order Rs. 2000</li>
          <li>❌ <strong>&gt;10 km:</strong> Delivery not available</li>
          <li>❌ <strong>Outside {DELIVERY_CITY}:</strong> Delivery not available</li>
        </ul>
      </div>

      {/* Technology Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>💡 Technology:</strong> This feature uses FREE open-source services:
        </p>
        <ul className="text-xs text-blue-600 mt-1 ml-4 list-disc">
          <li><strong>OpenStreetMap Nominatim</strong> - Reverse geocoding (city detection)</li>
          <li><strong>Haversine Formula</strong> - Distance calculation (pure mathematics)</li>
          <li><strong>Leaflet.js</strong> - Interactive map display (optional)</li>
          <li><strong>No API key required!</strong> 100% free to use 🎉</li>
        </ul>
      </div>

      {/* Developer Note */}
      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p className="text-xs text-purple-700">
          <strong>💻 For Developers:</strong> Use <code className="bg-purple-100 px-1 rounded">getOrderLimit(distanceKm)</code> 
          from <code className="bg-purple-100 px-1 rounded">@/lib/deliveryZoneUtils</code> to validate orders at checkout.
        </p>
      </div>
    </div>
  );
}
