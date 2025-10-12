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

    // Check if user has already provided location
    const savedLocation = localStorage.getItem('panngrill-location');
    if (!savedLocation) {
      // Show modal immediately once component is mounted
      setShowLocationModal(true);
    }
  }, [mounted]);

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
