'use client';

import { useState, useEffect } from 'react';
import LocationModal from './LocationModal';
import { DeliveryInfo } from '@/types';

export default function LocationProvider() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Always show modal when website loads
    console.log('LocationProvider: Showing modal on website load');
    setShowLocationModal(true);
  }, [mounted]);

  const handleLocationClose = (decision: DeliveryInfo | null) => {
    setShowLocationModal(false);
    if (typeof window !== 'undefined') {
      if (decision) {
        console.log('Location decision:', decision);
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

  return (
    <LocationModal
      open={showLocationModal}
      onClose={handleLocationClose}
    />
  );
}
