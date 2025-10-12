/**
 * Delivery Zone Utilities
 * Handles distance calculations, order limits, and delivery zone validation
 * Now using FREE OpenStreetMap APIs (no API key required!)
 */

// Restaurant coordinates - The Pan N Grill, Jhang
export const RESTAURANT_COORDS = { 
  lat: 31.277761, 
  lng: 72.321373 
};

// Delivery city constraint
export const DELIVERY_CITY = 'Jhang';

// OpenStreetMap Nominatim API endpoint (FREE - no API key needed)
export const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org';

/**
 * Order limit rules based on distance
 */
export interface OrderLimitRule {
  minDistance: number;
  maxDistance: number;
  minOrder: number;
  message: string;
  emoji: string;
}

export const ORDER_LIMIT_RULES: OrderLimitRule[] = [
  {
    minDistance: 0,
    maxDistance: 2,
    minOrder: 0,
    message: 'No minimum order required',
    emoji: '✅'
  },
  {
    minDistance: 2.01,
    maxDistance: 5,
    minOrder: 1000,
    message: 'Minimum order: Rs. 1000',
    emoji: '⚠️'
  },
  {
    minDistance: 5.01,
    maxDistance: Infinity,
    minOrder: 1500,
    message: 'Minimum order: Rs. 1500',
    emoji: '⚠️'
  }
];

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Get order limit based on distance
 * @param distanceKm - Distance in kilometers
 * @returns Order limit rule
 */
export const getOrderLimit = (distanceKm: number): OrderLimitRule => {
  const rule = ORDER_LIMIT_RULES.find(
    (r) => distanceKm >= r.minDistance && distanceKm <= r.maxDistance
  );
  
  return rule || ORDER_LIMIT_RULES[ORDER_LIMIT_RULES.length - 1];
};

/**
 * Check if a city is within delivery zone
 * @param cityName - Name of the city
 * @returns true if delivery is available
 */
export const isDeliveryAvailable = (cityName: string | null): boolean => {
  if (!cityName) return false;
  return cityName.toLowerCase().includes(DELIVERY_CITY.toLowerCase());
};

/**
 * Geocode coordinates to get city name using OpenStreetMap Nominatim API (FREE!)
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns City name or null
 */
export const getCityFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    // OpenStreetMap Nominatim reverse geocoding - NO API KEY REQUIRED!
    const response = await fetch(
      `${NOMINATIM_API_URL}/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'PanNGrill-Restaurant-App/1.0' // Required by Nominatim
        }
      }
    );

    if (!response.ok) {
      throw new Error('Nominatim API request failed');
    }

    const data = await response.json();

    if (!data || !data.address) {
      console.error('Nominatim geocoding failed: No address data');
      return null;
    }

    // Extract city from address data
    // Nominatim provides multiple fields that could contain the city
    const city = 
      data.address.city || 
      data.address.town || 
      data.address.village || 
      data.address.municipality ||
      data.address.county ||
      null;

    return city;
  } catch (error) {
    console.error('Error fetching city from coordinates:', error);
    return null;
  }
};

/**
 * Calculate distance using Haversine formula (FREE - no API needed!)
 * This is now the primary method since we removed Google Distance Matrix API
 * @param userLat - User latitude
 * @param userLng - User longitude
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  userLat: number,
  userLng: number
): number => {
  return calculateHaversineDistance(
    userLat,
    userLng,
    RESTAURANT_COORDS.lat,
    RESTAURANT_COORDS.lng
  );
};

/**
 * Validate if order total meets minimum requirement
 * @param orderTotal - Total order amount
 * @param minOrder - Minimum order requirement
 * @returns true if order meets requirement
 */
export const validateOrderTotal = (orderTotal: number, minOrder: number): boolean => {
  return orderTotal >= minOrder;
};

/**
 * Get user's current location using browser Geolocation API
 * @returns Promise with coordinates or error
 */
export const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
