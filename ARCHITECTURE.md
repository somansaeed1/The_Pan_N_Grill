# 🗺️ Delivery Zone Feature - Architecture Overview

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         CheckDeliveryZone Component                      │   │
│  │         (components/CheckDeliveryZone.tsx)               │   │
│  │                                                           │   │
│  │  • Detect Location Button                                │   │
│  │  • Loading States                                        │   │
│  │  • Results Display                                       │   │
│  │  • Interactive Map                                       │   │
│  │  • Error Messages                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         useDeliveryZone Hook (Optional)                  │   │
│  │         (hooks/useDeliveryZone.ts)                       │   │
│  │                                                           │   │
│  │  • State Management                                      │   │
│  │  • Location Detection                                    │   │
│  │  • Order Validation                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         deliveryZoneUtils.ts                             │   │
│  │         (lib/deliveryZoneUtils.ts)                       │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  getUserLocation()                                │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Browser Geolocation API                          │   │   │
│  │  │  → Returns: { lat, lng }                          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  getCityFromCoordinates(lat, lng, apiKey)        │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Google Geocoding API                            │   │   │
│  │  │  → Returns: "Jhang" or "Faisalabad" etc.         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  calculateDistanceWithGoogle(lat, lng, apiKey)   │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Google Distance Matrix API                       │   │   │
│  │  │  → Returns: 4.5 (km) - Road Distance             │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  calculateHaversineDistance(lat1, lng1, ...)     │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Mathematical Formula (No API)                    │   │   │
│  │  │  → Returns: 4.2 (km) - Direct Distance           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  getOrderLimit(distanceKm)                        │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Rule Engine                                      │   │   │
│  │  │  → 0-2km: Rs. 0                                   │   │   │
│  │  │  → 3-5km: Rs. 1000                                │   │   │
│  │  │  → >5km: Rs. 1500                                 │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  isDeliveryAvailable(cityName)                    │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  City Validation                                  │   │   │
│  │  │  → "Jhang" ✅ Allowed                             │   │   │
│  │  │  → Other cities ❌ Not allowed                    │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Browser          │  │ Google           │  │ Google       │  │
│  │ Geolocation      │  │ Geocoding        │  │ Distance     │  │
│  │ API              │  │ API              │  │ Matrix API   │  │
│  │                  │  │                  │  │              │  │
│  │ Free             │  │ 40k free/month   │  │ 40k free/mo  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Step-by-Step Process:

```
1. User Action
   └─> Click "Detect My Location" button
       │
       ▼
2. Location Detection
   └─> getUserLocation()
       └─> Browser Geolocation API
           └─> User Approves
               └─> Returns: { lat: 31.278, lng: 72.321 }
               │
               ▼
3. City Detection (Optional - if API key available)
   └─> getCityFromCoordinates(lat, lng, apiKey)
       └─> Google Geocoding API
           └─> Returns: "Jhang"
               │
               ▼
4. City Validation
   └─> isDeliveryAvailable("Jhang")
       └─> "Jhang" === deliveryCity?
           ├─> Yes ✅ Continue
           └─> No ❌ Show error: "Can't deliver to your location"
               │
               ▼
5. Distance Calculation
   └─> Try: calculateDistanceWithGoogle(lat, lng, apiKey)
       ├─> Success: Returns 4.5 km
       └─> Fail: calculateHaversineDistance(lat, lng, ...)
           └─> Returns 4.2 km
               │
               ▼
6. Order Limit Determination
   └─> getOrderLimit(4.5)
       └─> Check rules:
           ├─> 0-2 km? No
           ├─> 3-5 km? Yes ✅
           └─> Return: { minOrder: 1000, message: "Min Rs. 1000" }
               │
               ▼
7. Display Results
   └─> Show:
       ├─> City: "Jhang" ✅
       ├─> Distance: 4.5 km ✅
       ├─> Min Order: Rs. 1000 ✅
       └─> Map with markers ✅
```

## 🏗️ Component Hierarchy

```
App Root
│
├─── Layout
│    │
│    ├─── Navbar
│    │
│    ├─── Page Content
│    │    │
│    │    ├─── /delivery-zone/page.tsx
│    │    │    │
│    │    │    └─── CheckDeliveryZone Component ⭐
│    │    │         │
│    │    │         ├─── Header Section
│    │    │         │
│    │    │         ├─── Action Buttons
│    │    │         │    ├─── Detect Location Button
│    │    │         │    ├─── Reset Button
│    │    │         │    └─── Toggle Google API Checkbox
│    │    │         │
│    │    │         ├─── Results Display
│    │    │         │    ├─── Error Message (if any)
│    │    │         │    └─── Success Info Cards
│    │    │         │         ├─── City Card
│    │    │         │         ├─── Distance Card
│    │    │         │         └─── Order Limit Card
│    │    │         │
│    │    │         ├─── Google Map
│    │    │         │    ├─── Restaurant Marker (🍽️)
│    │    │         │    ├─── User Marker (📍)
│    │    │         │    └─── Polyline (connecting line)
│    │    │         │
│    │    │         └─── Info Section
│    │    │              └─── Delivery Rules List
│    │    │
│    │    └─── /checkout/page.tsx (Your Integration)
│    │         │
│    │         └─── useDeliveryZone Hook ⭐
│    │              │
│    │              ├─── Location Detection Logic
│    │              ├─── Order Validation
│    │              └─── State Management
│    │
│    └─── Footer
│
└─── Providers
     ├─── CartProvider
     └─── LocationProvider (existing)
```

## 📦 File Dependencies

```
CheckDeliveryZone.tsx
├─── Imports:
│    ├─── React (useState, useCallback, useEffect)
│    ├─── @react-google-maps/api
│    │    ├─── useLoadScript
│    │    ├─── GoogleMap
│    │    ├─── Marker
│    │    └─── Polyline
│    │
│    └─── lib/deliveryZoneUtils.ts
│         ├─── RESTAURANT_COORDS
│         ├─── DELIVERY_CITY
│         ├─── calculateHaversineDistance
│         ├─── getCityFromCoordinates
│         ├─── calculateDistanceWithGoogle
│         ├─── getOrderLimit
│         ├─── isDeliveryAvailable
│         ├─── getUserLocation
│         └─── OrderLimitRule (type)
│
└─── Environment Variables:
     └─── process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

```
useDeliveryZone.ts (Hook)
├─── Imports:
│    ├─── React (useState, useCallback)
│    │
│    └─── lib/deliveryZoneUtils.ts
│         ├─── getUserLocation
│         ├─── getCityFromCoordinates
│         ├─── calculateHaversineDistance
│         ├─── calculateDistanceWithGoogle
│         ├─── getOrderLimit
│         ├─── isDeliveryAvailable
│         └─── RESTAURANT_COORDS
│
└─── Returns:
     ├─── State: { userLocation, cityName, distanceKm, orderRule, ... }
     ├─── Actions: { detectDeliveryZone, reset }
     └─── Helpers: { validateOrder }
```

## 🎯 Integration Points

### Checkout Page Integration:

```
Checkout Flow
│
├─── 1. User adds items to cart
│
├─── 2. User goes to checkout
│    │
│    └─── CheckoutPage Component
│         │
│         ├─── Import: useDeliveryZone()
│         │
│         ├─── Step 1: Location Detection
│         │    └─── detectDeliveryZone()
│         │         ├─> Get user location
│         │         ├─> Validate city
│         │         └─> Calculate distance & limits
│         │
│         ├─── Step 2: Show Results
│         │    └─── Display:
│         │         ├─> Distance
│         │         ├─> Min order requirement
│         │         └─> Cart total comparison
│         │
│         ├─── Step 3: Order Validation
│         │    └─── validateOrder(cartTotal)
│         │         ├─> Check if cartTotal >= minOrder
│         │         └─> Return { valid, message }
│         │
│         └─── Step 4: Submit Order
│              └─── if (orderValidation.valid) {
│                   └─> Submit order
│                   } else {
│                   └─> Show error
│                   }
│
└─── 3. Order submitted ✅
```

## 🔐 Security Flow

```
API Key Management
│
├─── Configuration
│    └─── .env.local (local)
│         └─── NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
│              │
│              ├─> ✅ Not committed to Git (.gitignore)
│              └─> ✅ Environment variables only
│
├─── Google Cloud Console
│    │
│    ├─── API Key Restrictions
│    │    ├─> HTTP Referrers: localhost:3000/*, yourdomain.com/*
│    │    └─> API Restrictions: Only Maps, Geocoding, Distance Matrix
│    │
│    └─── Billing & Quotas
│         ├─> Free tier: $200/month credit
│         ├─> Set quotas to prevent abuse
│         └─> Set up billing alerts
│
└─── Client-Side Usage
     └─── NEXT_PUBLIC_* prefix
          ├─> Safe for client-side exposure
          ├─> Protected by domain restrictions
          └─> Limited by API restrictions
```

## 📊 Performance Optimization

```
Performance Strategy
│
├─── Lazy Loading
│    └─> Map loads only when location detected
│         └─> Saves initial page load time
│
├─── Conditional API Calls
│    ├─> Geocoding: Only if API key exists
│    ├─> Distance Matrix: Optional (toggle)
│    └─> Fallback: Haversine (no API call)
│
├─── Single Calls
│    └─> Each API called once per detection
│         └─> No redundant requests
│
└─── Future Optimizations (Optional)
     ├─> localStorage caching
     ├─> Server-side caching
     └─> Debouncing rapid calls
```

## 🧪 Testing Architecture

```
Testing Layers
│
├─── Unit Tests (Utilities)
│    └─> lib/deliveryZoneTestUtils.ts
│         ├─> Test distance calculations
│         ├─> Test order limit rules
│         ├─> Test city validation
│         └─> Mock API responses
│
├─── Integration Tests (Component)
│    └─> Test complete flow
│         ├─> Location detection
│         ├─> API calls
│         ├─> State updates
│         └─> UI rendering
│
├─── Browser Console Tests
│    └─> window.testDeliveryZone
│         ├─> mockNearby()
│         ├─> mockMedium()
│         ├─> mockFar()
│         ├─> mockOutside()
│         └─> testAll()
│
└─── Manual Testing
     ├─> Different browsers
     ├─> Different devices
     ├─> Different locations
     └─> Error scenarios
```

## 🌐 Deployment Architecture

```
Development → Staging → Production

Development Environment
├─── localhost:3000
├─── .env.local with dev API key
├─── Hot reload enabled
└─── Test helpers available

Staging Environment
├─── staging.yoursite.com
├─── Environment variables via platform
├─── Production build
└─── Full testing before prod

Production Environment
├─── yoursite.com
├─── Secured environment variables
├─── API key restricted to domain
├─── Monitoring enabled
└─── Error tracking active
```

---

## 📚 Quick Reference

### Key Constants:
```typescript
RESTAURANT_COORDS = { lat: 31.277761, lng: 72.321373 }
DELIVERY_CITY = "Jhang"
ORDER_LIMIT_RULES = [0-2km: Rs.0, 3-5km: Rs.1000, >5km: Rs.1500]
```

### Key Functions:
```typescript
getUserLocation() → { lat, lng }
getCityFromCoordinates(lat, lng, key) → "Jhang"
calculateDistance(lat, lng, ...) → 4.5 (km)
getOrderLimit(distanceKm) → { minOrder: 1000, ... }
isDeliveryAvailable(city) → true/false
validateOrderTotal(total, minOrder) → true/false
```

### Key Files:
- Component: `components/CheckDeliveryZone.tsx`
- Utilities: `lib/deliveryZoneUtils.ts`
- Hook: `hooks/useDeliveryZone.ts`
- Demo: `app/delivery-zone/page.tsx`

---

**📖 For detailed implementation, see:**
- Architecture: This file
- Quick Start: `QUICK_START.md`
- Full Docs: `DELIVERY_ZONE_README.md`
- Setup Guide: `GOOGLE_MAPS_SETUP.md`
- Checklist: `CHECKLIST.md`

---

**Built with ❤️ for The Pan N Grill**
