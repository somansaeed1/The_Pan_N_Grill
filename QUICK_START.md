# 🚀 Quick Start Guide - Delivery Zone Feature

## ⚡ Getting Started in 5 Minutes

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
4. Create credentials → API Key
5. **Important**: Restrict your API key:
   - Application restrictions: HTTP referrers
   - Add: `localhost:3000/*` and your domain
   - API restrictions: Select only the 3 APIs above

### Step 2: Configure Environment

Edit `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### Step 3: Update Restaurant Location

Edit `lib/deliveryZoneUtils.ts`:

```typescript
export const RESTAURANT_COORDS = { 
  lat: 31.277761,  // ← Your restaurant latitude
  lng: 72.321373   // ← Your restaurant longitude
};

export const DELIVERY_CITY = 'Jhang'; // ← Your delivery city
```

**How to find coordinates:**
- Google Maps → Right-click your location → Copy coordinates
- Or use: https://www.latlong.net/

### Step 4: Test the Component

1. Start your dev server:
```bash
npm run dev
```

2. Visit: `http://localhost:3000/delivery-zone`

3. Click "Detect My Location"

4. Allow location permission in browser

5. See your results! 🎉

---

## 📋 Usage Examples

### Basic Usage (Standalone Page)

```tsx
// app/delivery/page.tsx
import CheckDeliveryZone from '@/components/CheckDeliveryZone';

export default function DeliveryPage() {
  return <CheckDeliveryZone />;
}
```

### Advanced Usage (Checkout Integration)

```tsx
// app/checkout/page.tsx
'use client';

import { useDeliveryZone } from '@/hooks/useDeliveryZone';
import { useCart } from '@/components/Cart/CartProvider';

export default function CheckoutPage() {
  const { getTotalPrice } = useCart();
  const {
    distanceKm,
    orderRule,
    deliveryAllowed,
    detectDeliveryZone,
    validateOrder
  } = useDeliveryZone();

  const cartTotal = getTotalPrice();
  const orderValidation = validateOrder(cartTotal);

  return (
    <div>
      <button onClick={detectDeliveryZone}>
        📍 Check Delivery Zone
      </button>

      {deliveryAllowed && orderRule && (
        <div>
          <p>Distance: {distanceKm} km</p>
          <p>Min Order: Rs. {orderRule.minOrder}</p>
          
          {!orderValidation.valid && (
            <p className="error">{orderValidation.message}</p>
          )}
        </div>
      )}

      <button disabled={!orderValidation.valid}>
        Place Order
      </button>
    </div>
  );
}
```

### Helper Functions (Utility Usage)

```tsx
import {
  calculateHaversineDistance,
  getOrderLimit,
  validateOrderTotal,
  RESTAURANT_COORDS
} from '@/lib/deliveryZoneUtils';

// Calculate distance
const distance = calculateHaversineDistance(
  31.280, 72.325,  // User coordinates
  RESTAURANT_COORDS.lat,
  RESTAURANT_COORDS.lng
);
// Returns: 4.2 (km)

// Get order limit
const rule = getOrderLimit(distance);
// Returns: { minOrder: 1000, message: '...', ... }

// Validate order
const isValid = validateOrderTotal(1500, rule.minOrder);
// Returns: true
```

---

## 🎨 Customization

### Change Order Limits

Edit `lib/deliveryZoneUtils.ts`:

```typescript
export const ORDER_LIMIT_RULES: OrderLimitRule[] = [
  {
    minDistance: 0,
    maxDistance: 2,
    minOrder: 0,           // ← Change this
    message: 'Free delivery!',
    emoji: '✅'
  },
  {
    minDistance: 2.01,
    maxDistance: 5,
    minOrder: 800,         // ← Change this
    message: 'Min Rs. 800',
    emoji: '⚠️'
  },
  {
    minDistance: 5.01,
    maxDistance: Infinity,
    minOrder: 1200,        // ← Change this
    message: 'Min Rs. 1200',
    emoji: '⚠️'
  }
];
```

### Change Map Style

Edit `components/CheckDeliveryZone.tsx`:

```typescript
const mapContainerStyle = {
  width: '100%',
  height: '500px',      // ← Change height
  borderRadius: '16px'  // ← Change border radius
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,  // ← Show map type selector
  streetViewControl: true, // ← Show street view
  fullscreenControl: true,
};
```

### Change Button Colors

Edit `components/CheckDeliveryZone.tsx`:

```tsx
// Find the detect button and change classes
className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 ..."
```

---

## 🛠️ Troubleshooting

### "Map not loading"
- ✅ Check API key is correct in `.env.local`
- ✅ Verify Maps JavaScript API is enabled
- ✅ Check API key restrictions allow your domain
- ✅ Open browser console for specific errors

### "Location permission denied"
- ✅ Site must use HTTPS (or localhost)
- ✅ Check browser location settings
- ✅ Try in incognito/private mode
- ✅ Clear site data and retry

### "Wrong distance calculated"
- ✅ Verify restaurant coordinates are correct
- ✅ Toggle "Use Google Distance Matrix API" checkbox
- ✅ Check Distance Matrix API is enabled
- ✅ Haversine gives "as the crow flies" distance (may differ from road distance)

### "City not detected"
- ✅ Check Geocoding API is enabled
- ✅ Verify API key has proper permissions
- ✅ Component will still work without city (uses distance only)
- ✅ Check network tab for API errors

---

## 📦 What Was Installed

### New Files Created
```
✅ components/CheckDeliveryZone.tsx          (Main component)
✅ lib/deliveryZoneUtils.ts                  (Core utilities)
✅ hooks/useDeliveryZone.ts                  (React hook)
✅ app/delivery-zone/page.tsx                (Demo page)
✅ app/checkout-example/page.tsx             (Integration example)
✅ .env.local                                (Environment config)
✅ DELIVERY_ZONE_README.md                   (Full documentation)
✅ QUICK_START.md                            (This file)
```

### Package Installed
```bash
@react-google-maps/api  # Google Maps React components
```

### Files Modified
```
✅ global.d.ts          (Added Google Maps TypeScript types)
```

---

## 📖 API Reference

### useDeliveryZone Hook

```typescript
const {
  userLocation,      // { lat, lng } | null
  cityName,          // string | null
  distanceKm,        // number | null
  orderRule,         // OrderLimitRule | null
  deliveryAllowed,   // boolean
  errorMessage,      // string | null
  loading,           // boolean
  detectDeliveryZone, // () => Promise<void>
  reset,             // () => void
  validateOrder      // (total: number) => { valid: boolean, message: string }
} = useDeliveryZone();
```

### Helper Functions

```typescript
// Get user location
getUserLocation() → Promise<{ lat: number, lng: number }>

// Calculate distance (Haversine)
calculateHaversineDistance(lat1, lon1, lat2, lon2) → number

// Calculate distance (Google API)
calculateDistanceWithGoogle(lat, lng, apiKey) → Promise<number | null>

// Get city name
getCityFromCoordinates(lat, lng, apiKey) → Promise<string | null>

// Get order limit rule
getOrderLimit(distanceKm) → OrderLimitRule

// Check delivery availability
isDeliveryAvailable(cityName) → boolean

// Validate order total
validateOrderTotal(orderTotal, minOrder) → boolean
```

---

## 🎯 Next Steps

1. ✅ Configure your API key
2. ✅ Update restaurant coordinates
3. ✅ Test on `/delivery-zone` page
4. ✅ Integrate into checkout page
5. ✅ Customize styling to match your brand
6. ✅ Test with different locations
7. ✅ Deploy to production

---

## 📞 Need Help?

- Read full docs: `DELIVERY_ZONE_README.md`
- Check example: Visit `/delivery-zone` or `/checkout-example`
- Review code: `components/CheckDeliveryZone.tsx`
- Check utils: `lib/deliveryZoneUtils.ts`

---

**Built with ❤️ for The Pan N Grill**

🍕 Happy Coding! 🍔
