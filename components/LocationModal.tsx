'use client';

import { useState } from 'react';
import { DeliveryInfo } from '@/types';
import { calculateDistanceKm, SHOP_COORDS } from '@/lib/locationUtils';

interface LocationModalProps {
  open: boolean;
  onClose: (decision: DeliveryInfo | null) => void;
}

export default function LocationModal({ open, onClose }: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  const applyDecision = (lat: number, lng: number, displayName?: string) => {
    const dist = calculateDistanceKm(lat, lng, SHOP_COORDS.lat, SHOP_COORDS.lng);
    let decision: DeliveryInfo = {
      distanceKm: +dist.toFixed(2),
      allowed: true,
      minOrder: 0,
      message: '',
    };

    if (dist <= 3) {
      decision.message = 'You are within 3 km — delivery is free.';
      decision.minOrder = 0;
    } else if (dist > 3 && dist <= 5) {
      decision.message = `Delivery available — distance ${decision.distanceKm} km.`;
      decision.minOrder = 0;
    } else if (dist > 5 && dist <= 10) {
      decision.message = `You are ${decision.distanceKm} km away — minimum order PKR 2000 applies.`;
      decision.minOrder = 2000;
    } else {
      decision.message = `Delivery not available — ${decision.distanceKm} km is outside our delivery area.`;
      decision.allowed = false;
      decision.minOrder = 0;
    }

    // Save location if consent given
    try {
      if (consent) {
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        const locSnapshot = {
          lat: +lat,
          lng: +lng,
          timestamp: Date.now(),
          distanceKm: decision.distanceKm,
          message: decision.message,
          mapsLink,
          name: displayName || null,
        };
        localStorage.setItem('panngrill-location', JSON.stringify(locSnapshot));
      }
    } catch (e) {}

    onClose(decision);
  };

  const useGeolocation = () => {
    setError('');
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        const { latitude, longitude } = pos.coords;
        applyDecision(latitude, longitude);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError(
            'Permission denied. Please allow location access in your browser settings and try again.'
          );
        } else if (err.code === 2) {
          setError(
            'Position unavailable. Your device could not determine a location. Try again or enter it manually.'
          );
        } else if (err.code === 3) {
          setError('Location request timed out. Please try again.');
        } else {
          setError(
            'Unable to get your location. Please enter it manually or ensure location access is allowed.'
          );
        }
      },
      { timeout: 15000 }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-lg max-h-[85vh] overflow-auto">
        <h3 className="text-xl font-bold mb-2">Where are you located?</h3>
        <p className="text-gray-600 mb-4">
          We need your location to determine delivery availability and any minimum order requirements.
        </p>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <button
            onClick={useGeolocation}
            disabled={loading}
            className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:bg-gray-400 text-white py-2 rounded transition-colors"
          >
            {loading ? 'Getting location...' : 'Use my device location'}
          </button>

          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-2 rounded transition-colors"
          >
            Enter manually
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
          <input
            id="locConsent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="locConsent">
            Allow saving & sharing my current location for delivery (saved for 1 hour). I can clear
            this later.
          </label>
        </div>

        {showManualEntry && (
          <div className="mb-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter your address"
              className="w-full border px-3 py-2 rounded"
            />
            <p className="text-xs text-gray-500 mt-2">
              Manual address search functionality would connect to a geocoding API in production.
            </p>
          </div>
        )}

        <div className="flex justify-end items-center mt-4">
          <button
            onClick={() =>
              onClose({ distanceKm: null, allowed: true, minOrder: 0, message: 'Location not provided' })
            }
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}