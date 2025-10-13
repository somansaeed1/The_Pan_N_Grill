# 🚚 Delivery Zone Checker Feature

A comprehensive, production-ready Google Maps-powered delivery distance and order limit feature for The Pan N Grill restaurant.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Component Structure](#component-structure)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Functionality

- ✅ **Location Detection**: Uses browser Geolocation API to get user coordinates
- 🌍 **City Detection**: Google Geocoding API to identify city from coordinates
- 📏 **Distance Calculation**: 
  - Google Distance Matrix API for accurate road distance
  - Haversine formula as fallback for direct distance
- 📊 **Dynamic Order Limits**: 
  - 0-2 km: No minimum order
  - 3-5 km: Rs. 1000 minimum
  - >5 km: Rs. 1500 minimum
- 🚫 **Delivery Zone Validation**: Only delivers within Jhang city
- 🗺️ **Interactive Map**: Shows user location, restaurant, and distance polyline
- ⚡ **Real-time Updates**: Instant feedback with loading states
- 🎨 **Beautiful UI**: Responsive design with Tailwind CSS

### Technical Features

- 🔒 **Secure API Keys**: Environment variable configuration
- 🛡️ **Error Handling**: Graceful fallbacks for all API failures
- 📱 **Mobile Responsive**: Works on all device sizes
- ♿ **Accessible**: ARIA labels and keyboard navigation
- 🔄 **Reusable Utilities**: Helper functions for checkout validation
- 🎯 **TypeScript**: Full type safety

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install @react-google-maps/api
```

### 2. Set Up Environment Variables

Copy `.env.local` file and add your Google Maps API key:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here
```

### 3. Enable Google Maps APIs

Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) and enable:

1. **Maps JavaScript API** (for map display)
2. **Geocoding API** (for city detection)
3. **Distance Matrix API** (for distance calculation)

**Important**: Restrict your API key to:
- HTTP referrers (for web): `localhost:3000/*` and your production domain
- API restrictions: Only enable the 3 APIs mentioned above

## ⚙️ Configuration

### Restaurant Coordinates

Update restaurant location in `lib/deliveryZoneUtils.ts`:

```typescript
export const RESTAURANT_COORDS = { 
  lat: 31.277761,  // Your latitude
  lng: 72.321373   // Your longitude
};
```

### Delivery City

```typescript
export const DELIVERY_CITY = 'Jhang'; // Change to your city
```

### Order Limit Rules

Customize in `lib/deliveryZoneUtils.ts`:

```typescript
export const ORDER_LIMIT_RULES: OrderLimitRule[] = [
  {
    minDistance: 0,
    maxDistance: 2,
    minOrder: 0,
    message: 'No minimum order required',
    emoji: '✅'
  },
  // Add more rules...
];
```

## 📖 Usage

### Basic Implementation

```tsx
import CheckDeliveryZone from '@/components/CheckDeliveryZone';

export default function MyPage() {
  return (
    <div>
      <CheckDeliveryZone />
    </div>
  );
}
```

### Use in Checkout Validation

```tsx
import { getOrderLimit, validateOrderTotal } from '@/lib/deliveryZoneUtils';

function CheckoutPage() {
  const cartTotal = 1200; // Your cart total
  const userDistanceKm = 3.5; // From user location state

  const orderRule = getOrderLimit(userDistanceKm);
  const canProceed = validateOrderTotal(cartTotal, orderRule.minOrder);

  if (!canProceed) {
    return (
      <div className="alert">
        ⚠️ Minimum order is Rs. {orderRule.minOrder} for your location.
        Current total: Rs. {cartTotal}
      </div>
    );
  }

  // Show checkout form...
}
```

### Programmatic Location Check

```tsx
import { 
  getUserLocation, 
  getCityFromCoordinates,
  calculateHaversineDistance,
  RESTAURANT_COORDS 
} from '@/lib/deliveryZoneUtils';

async function checkDelivery() {
  try {
    // Get user location
    const coords = await getUserLocation();
    
    // Get city name
    const city = await getCityFromCoordinates(
      coords.lat, 
      coords.lng, 
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
    );
    
    // Calculate distance
    const distance = calculateHaversineDistance(
      coords.lat,
      coords.lng,
      RESTAURANT_COORDS.lat,
      RESTAURANT_COORDS.lng
    );
    
    console.log(`City: ${city}, Distance: ${distance} km`);
  } catch (error) {
    console.error('Location check failed:', error);
  }
}
```

## 📚 API Reference

### Exported Functions

#### `getUserLocation()`
Get user's current location using browser Geolocation API.

```typescript
const coords = await getUserLocation();
// Returns: { lat: number, lng: number }
```

#### `getCityFromCoordinates(lat, lng, apiKey)`
Get city name from coordinates using Google Geocoding API.

```typescript
const city = await getCityFromCoordinates(31.277761, 72.321373, apiKey);
// Returns: string | null
```

#### `calculateHaversineDistance(lat1, lon1, lat2, lon2)`
Calculate distance between two points using Haversine formula.

```typescript
const distance = calculateHaversineDistance(31.277, 72.321, 31.280, 72.325);
// Returns: number (in km)
```

#### `calculateDistanceWithGoogle(userLat, userLng, apiKey)`
Calculate distance using Google Distance Matrix API.

```typescript
const distance = await calculateDistanceWithGoogle(31.277, 72.321, apiKey);
// Returns: number | null (in km)
```

#### `getOrderLimit(distanceKm)`
Get order limit rule based on distance.

```typescript
const rule = getOrderLimit(3.5);
// Returns: OrderLimitRule
// {
//   minDistance: 2.01,
//   maxDistance: 5,
//   minOrder: 1000,
//   message: 'Minimum order: Rs. 1000',
//   emoji: '⚠️'
// }
```

#### `isDeliveryAvailable(cityName)`
Check if delivery is available in the city.

```typescript
const available = isDeliveryAvailable('Jhang');
// Returns: boolean
```

#### `validateOrderTotal(orderTotal, minOrder)`
Validate if order meets minimum requirement.

```typescript
const isValid = validateOrderTotal(1200, 1000);
// Returns: boolean
```

## 🏗️ Component Structure

```
components/
└── CheckDeliveryZone.tsx          # Main component

lib/
├── deliveryZoneUtils.ts           # Core utilities
└── locationUtils.ts               # (existing) Distance helper

app/
└── delivery-zone/
    └── page.tsx                   # Example usage page

types/
└── index.ts                       # TypeScript interfaces
```

## 🧪 Testing

### Test Without Google API Key

The component works without an API key using Haversine formula:

1. Comment out `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
2. Distance calculation will use Haversine (direct distance)
3. Map and city detection won't be available

### Test Location Permissions

**Browser Allow:**
- Should show location and calculate distance

**Browser Deny:**
- Should show friendly error message
- User can retry

### Test Different Distances

Modify test coordinates in console:

```javascript
// In browser console on delivery-zone page
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: 31.280,  // Test coordinates
      longitude: 72.325,
      accuracy: 100
    }
  });
};
```

## 🔧 Troubleshooting

### Map Not Loading

**Problem**: Map shows blank or error

**Solutions**:
1. Check if `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
2. Verify API key has Maps JavaScript API enabled
3. Check browser console for specific errors
4. Ensure API key restrictions allow your domain

### Location Permission Denied

**Problem**: Browser doesn't ask for location permission

**Solutions**:
1. Check if HTTPS is enabled (required for geolocation)
2. In Chrome: Settings → Privacy → Site Settings → Location
3. Clear site data and retry
4. Try in incognito mode

### Distance Calculation Issues

**Problem**: Distance seems incorrect

**Solutions**:
1. Toggle "Use Google Distance Matrix API" checkbox
2. Verify restaurant coordinates are correct
3. Check if Distance Matrix API is enabled in Google Cloud
4. Ensure API key has no IP restrictions blocking requests

### "Order can't be placed" Error

**Problem**: Shows error even though in correct city

**Solutions**:
1. Check `DELIVERY_CITY` constant matches actual city name
2. City detection might return slightly different name (e.g., "Jhang City" vs "Jhang")
3. Update `isDeliveryAvailable()` to use `.includes()` for partial matching
4. Check Google Geocoding API response in network tab

### TypeScript Errors

**Problem**: Type errors with Google Maps

**Solutions**:
1. Ensure `@react-google-maps/api` is installed
2. Check `global.d.ts` has Google Maps interface
3. Run `npm install @types/google.maps` if needed

## 🎨 Customization

### Styling

Component uses Tailwind CSS. Customize in `CheckDeliveryZone.tsx`:

```tsx
// Change button colors
className="bg-gradient-to-r from-blue-500 to-purple-500 ..."

// Adjust map size
const mapContainerStyle = {
  width: '100%',
  height: '500px', // Change height
  borderRadius: '12px'
};
```

### Map Markers

Customize marker icons:

```tsx
// Restaurant marker
icon={{
  url: '/images/restaurant-icon.png', // Your custom icon
  scaledSize: new window.google.maps.Size(60, 60)
}}

// User marker
icon={{
  url: '/images/user-icon.png',
  scaledSize: new window.google.maps.Size(40, 40)
}}
```

### Distance Calculation Method

Force Haversine or Google API:

```tsx
// In CheckDeliveryZone.tsx
const [useGoogleDistance, setUseGoogleDistance] = useState(false); // Use Haversine
// or
const [useGoogleDistance, setUseGoogleDistance] = useState(true);  // Use Google API
```

## 🔐 Security Best Practices

1. **API Key Protection**:
   - Never commit `.env.local` to git
   - Use environment variables only
   - Restrict API key to specific domains
   - Enable only required APIs

2. **Rate Limiting**:
   - Google APIs have daily quotas
   - Implement caching for repeated locations
   - Consider server-side API calls for sensitive operations

3. **Input Validation**:
   - All user inputs are validated
   - Coordinates are bounds-checked
   - API responses are verified before use

## 📊 Performance Optimization

- **Lazy Loading**: Map only loads when location is detected
- **Debouncing**: Prevent rapid API calls
- **Caching**: Store location results in localStorage (if needed)
- **Fallback**: Haversine formula reduces API dependency

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (Chrome, Safari)

**Requirements**:
- HTTPS (for Geolocation API)
- JavaScript enabled
- Cookies/LocalStorage enabled

## 📄 License

This feature is part of The Pan N Grill Next.js project.

## 🤝 Support

For issues or questions:
- Check troubleshooting section above
- Review browser console errors
- Verify Google Cloud Console API settings
- Contact development team

---

**Built with ❤️ for The Pan N Grill**
