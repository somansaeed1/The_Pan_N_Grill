'use client';

/**
 * LeafletMap Component
 * 
 * Open-source alternative to Google Maps using Leaflet.js
 * Displays restaurant and user locations with a line connecting them
 * Uses OpenStreetMap tiles (FREE!)
 */

import { useEffect, useRef } from 'react';

export default function LeafletMap({ userLocation, restaurantLocation, distance }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Clean up previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Calculate center point between user and restaurant
      const centerLat = (userLocation.lat + restaurantLocation.lat) / 2;
      const centerLng = (userLocation.lng + restaurantLocation.lng) / 2;

      // Create map instance
      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);

      // Add OpenStreetMap tiles (FREE!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom icon for restaurant
      const restaurantIcon = L.divIcon({
        html: '<div style="font-size: 32px;">🍽️</div>',
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      // Custom icon for user
      const userIcon = L.divIcon({
        html: '<div style="font-size: 32px;">📍</div>',
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      // Add restaurant marker
      L.marker([restaurantLocation.lat, restaurantLocation.lng], {
        icon: restaurantIcon
      })
        .addTo(map)
        .bindPopup('<b>The Pan N Grill</b><br>Jhang, Pakistan')
        .openPopup();

      // Add user marker
      L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon
      })
        .addTo(map)
        .bindPopup(`<b>Your Location</b><br>Distance: ${distance?.toFixed(2)} km`);

      // Draw line between locations
      L.polyline(
        [
          [restaurantLocation.lat, restaurantLocation.lng],
          [userLocation.lat, userLocation.lng]
        ],
        {
          color: '#F97316',
          weight: 3,
          opacity: 0.8,
          dashArray: '10, 10'
        }
      ).addTo(map);

      // Fit map to show both markers
      const bounds = L.latLngBounds([
        [restaurantLocation.lat, restaurantLocation.lng],
        [userLocation.lat, userLocation.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Store map instance
      mapInstanceRef.current = map;
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, restaurantLocation, distance]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-xl border-2 border-gray-200 shadow-lg"
        style={{ zIndex: 0 }}
      />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Map powered by <strong>OpenStreetMap</strong> & <strong>Leaflet.js</strong> (open-source)
      </div>
    </div>
  );
}
