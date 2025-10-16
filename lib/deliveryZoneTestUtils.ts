/**
 * Delivery Zone Testing Utilities
 * 
 * Helper functions and mock data for testing the delivery zone feature
 * without requiring actual location permissions or API calls
 */

import {
  calculateHaversineDistance,
  getOrderLimit,
  RESTAURANT_COORDS,
  isDeliveryAvailable
} from './deliveryZoneUtils';

/**
 * Test locations around Jhang for development/testing
 */
export const TEST_LOCATIONS = {
  // Within Jhang - Close (< 2km)
  nearRestaurant: {
    name: 'Near Restaurant',
    lat: 31.278761,
    lng: 72.322373,
    expectedDistance: 0.1,
    expectedCity: 'Jhang',
    expectedMinOrder: 0
  },
  
  // Within Jhang - Medium distance (3-5km)
  mediumDistance: {
    name: 'Medium Distance in Jhang',
    lat: 31.295000,
    lng: 72.335000,
    expectedDistance: 3.5,
    expectedCity: 'Jhang',
    expectedMinOrder: 1000
  },
  
  // Within Jhang - Far (>5km)
  farInJhang: {
    name: 'Far Location in Jhang',
    lat: 31.310000,
    lng: 72.350000,
    expectedDistance: 6.5,
    expectedCity: 'Jhang',
    expectedMinOrder: 1500
  },
  
  // Outside Jhang - Should be rejected
  outsideJhang: {
    name: 'Faisalabad',
    lat: 31.418715,
    lng: 73.079109,
    expectedDistance: 75,
    expectedCity: 'Faisalabad',
    expectedMinOrder: null // Not allowed
  },
  
  // Very close - edge case
  veryClose: {
    name: 'Next Door',
    lat: 31.277800,
    lng: 72.321400,
    expectedDistance: 0.01,
    expectedCity: 'Jhang',
    expectedMinOrder: 0
  }
};

/**
 * Mock geolocation for testing
 * Usage: Call this in browser console or before component mounts
 */
export const mockGeolocation = (lat: number, lng: number) => {
  if (typeof window !== 'undefined' && navigator.geolocation) {
    const mockPosition = {
      coords: {
        latitude: lat,
        longitude: lng,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      },
      timestamp: typeof window !== 'undefined' ? Date.now() : 0
    };

    // Override getCurrentPosition
    navigator.geolocation.getCurrentPosition = (success) => {
      success(mockPosition as GeolocationPosition);
    };

    console.log(`✅ Mocked geolocation to: ${lat}, ${lng}`);
  }
};

/**
 * Test all locations and verify expected results
 */
export const runDeliveryZoneTests = () => {
  console.log('🧪 Running Delivery Zone Tests...\n');
  
  const results = Object.entries(TEST_LOCATIONS).map(([key, location]) => {
    const distance = calculateHaversineDistance(
      location.lat,
      location.lng,
      RESTAURANT_COORDS.lat,
      RESTAURANT_COORDS.lng
    );
    
    const orderRule = getOrderLimit(distance);
    const cityAllowed = isDeliveryAvailable(location.expectedCity);
    
    const passed = 
      Math.abs(distance - location.expectedDistance) < 1 && // Within 1km tolerance
      (location.expectedMinOrder === null || orderRule.minOrder === location.expectedMinOrder);
    
    return {
      location: location.name,
      passed,
      distance,
      expectedDistance: location.expectedDistance,
      minOrder: orderRule.minOrder,
      expectedMinOrder: location.expectedMinOrder,
      cityAllowed
    };
  });
  
  console.table(results);
  
  const allPassed = results.every(r => r.passed);
  console.log(allPassed ? '✅ All tests passed!' : '❌ Some tests failed');
  
  return results;
};

/**
 * Mock Google Geocoding API response
 */
export const mockGeocodingResponse = (city: string) => ({
  status: 'OK',
  results: [
    {
      address_components: [
        {
          long_name: city,
          short_name: city,
          types: ['locality', 'political']
        }
      ],
      formatted_address: `${city}, Punjab, Pakistan`,
      geometry: {
        location: {
          lat: 31.277761,
          lng: 72.321373
        }
      }
    }
  ]
});

/**
 * Mock Google Distance Matrix API response
 */
export const mockDistanceMatrixResponse = (distanceMeters: number) => ({
  status: 'OK',
  rows: [
    {
      elements: [
        {
          status: 'OK',
          distance: {
            value: distanceMeters,
            text: `${(distanceMeters / 1000).toFixed(1)} km`
          },
          duration: {
            value: Math.round(distanceMeters / 10), // Rough estimate
            text: `${Math.round(distanceMeters / 1000 / 0.5)} mins`
          }
        }
      ]
    }
  ]
});

/**
 * Generate test data for order validation
 */
export const generateOrderTestCases = () => {
  return [
    {
      distance: 1.5,
      orderTotal: 500,
      shouldPass: true,
      reason: 'No minimum order for < 2km'
    },
    {
      distance: 3.5,
      orderTotal: 800,
      shouldPass: false,
      reason: 'Below Rs. 1000 minimum for 3-5km'
    },
    {
      distance: 3.5,
      orderTotal: 1000,
      shouldPass: true,
      reason: 'Meets Rs. 1000 minimum for 3-5km'
    },
    {
      distance: 6.5,
      orderTotal: 1200,
      shouldPass: false,
      reason: 'Below Rs. 1500 minimum for >5km'
    },
    {
      distance: 6.5,
      orderTotal: 1500,
      shouldPass: true,
      reason: 'Meets Rs. 1500 minimum for >5km'
    }
  ];
};

/**
 * Performance testing - measure API call times
 */
export const measurePerformance = async (fn: () => Promise<any>, label: string) => {
  const start = performance.now();
  try {
    await fn();
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return end - start;
  } catch (error) {
    console.error(`❌ ${label} failed:`, error);
    return -1;
  }
};

/**
 * Browser console helper - Use in dev tools
 * 
 * Usage:
 * ```javascript
 * // In browser console
 * window.testDeliveryZone = {
 *   mockLocation: (lat, lng) => { ... },
 *   testAll: () => { ... },
 *   mockNearby: () => { ... },
 *   mockFar: () => { ... }
 * }
 * ```
 */
export const setupBrowserTestHelpers = () => {
  if (typeof window !== 'undefined') {
    (window as any).testDeliveryZone = {
      mockLocation: mockGeolocation,
      testAll: runDeliveryZoneTests,
      mockNearby: () => mockGeolocation(
        TEST_LOCATIONS.nearRestaurant.lat,
        TEST_LOCATIONS.nearRestaurant.lng
      ),
      mockMedium: () => mockGeolocation(
        TEST_LOCATIONS.mediumDistance.lat,
        TEST_LOCATIONS.mediumDistance.lng
      ),
      mockFar: () => mockGeolocation(
        TEST_LOCATIONS.farInJhang.lat,
        TEST_LOCATIONS.farInJhang.lng
      ),
      mockOutside: () => mockGeolocation(
        TEST_LOCATIONS.outsideJhang.lat,
        TEST_LOCATIONS.outsideJhang.lng
      ),
      locations: TEST_LOCATIONS
    };
    
    console.log('✅ Test helpers loaded! Try:');
    console.log('  window.testDeliveryZone.mockNearby()');
    console.log('  window.testDeliveryZone.mockMedium()');
    console.log('  window.testDeliveryZone.mockFar()');
    console.log('  window.testDeliveryZone.mockOutside()');
    console.log('  window.testDeliveryZone.testAll()');
  }
};

/**
 * Validate API key configuration
 */
export const validateApiKeyConfig = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set');
    return false;
  }
  
  if (apiKey === 'your-google-maps-api-key-here') {
    console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is still set to placeholder');
    return false;
  }
  
  if (apiKey.length < 30) {
    console.warn('⚠️ API key seems too short. Please verify.');
    return false;
  }
  
  console.log('✅ API key configuration looks good');
  return true;
};

/**
 * Log delivery zone configuration
 */
export const logConfig = () => {
  console.group('🔧 Delivery Zone Configuration');
  console.log('Restaurant:', RESTAURANT_COORDS);
  console.log('API Key Set:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  console.log('API Key Length:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0);
  console.groupEnd();
};

// Auto-setup test helpers in development
if (process.env.NODE_ENV === 'development') {
  setupBrowserTestHelpers();
}
