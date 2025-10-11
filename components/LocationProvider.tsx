'use client';

import { useState, useEffect } from 'react';
import LocationModal from './LocationModal';
import { DeliveryInfo } from '@/types';

export default function LocationProvider() {
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Check if user has already provided location
    const savedLocation = localStorage.getItem('panngrill-location');
    if (!savedLocation) {
      // Show modal after a short delay to allow page to load
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationClose = (decision: DeliveryInfo | null) => {
    setShowLocationModal(false);
    if (decision) {
      console.log('Location decision:', decision);
    }
  };

  return (
    <LocationModal
      open={showLocationModal}
      onClose={handleLocationClose}
    />
  );
}
