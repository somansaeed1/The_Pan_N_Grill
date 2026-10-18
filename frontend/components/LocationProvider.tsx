'use client';

import { useState, useEffect } from 'react';
import LocationModal from './LocationModal';
import { DeliveryInfo } from '@/types';

export default function LocationProvider() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only ask when we do not already know the customer's choice.
    let alreadyAnswered = false;
    try {
      alreadyAnswered = localStorage.getItem('panngrill-location') !== null;
    } catch {}

    // Show modal after a small delay to avoid hydration mismatch
    const timer = setTimeout(() => {
      if (!alreadyAnswered) setShowLocationModal(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationClose = (decision: DeliveryInfo | null) => {
    setShowLocationModal(false);
    if (typeof window !== 'undefined') {
      if (decision) {
        // Save location data to localStorage in the format expected by useDeliveryZone
        localStorage.setItem('panngrill-location', JSON.stringify({
          ...decision,
          hasLocation: true,
          deliveryAllowed: decision.allowed
        }));
      } else {
        // User skipped - save a "skipped" state
        localStorage.setItem('panngrill-location', JSON.stringify({
          skipped: true,
          allowed: true,
          minOrder: 0,
          message: 'Location skipped by user',
          hasLocation: true,
          deliveryAllowed: true
        }));
      }
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LocationModal
      open={showLocationModal}
      onClose={handleLocationClose}
    />
  );
}
