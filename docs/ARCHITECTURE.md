# 🗺️ Manual Location Search Module - Architecture Overview

## 📊 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         LocationSearch Component                         │   │
│  │         (components/LocationSearch.tsx)                  │   │
│  │                                                           │   │
│  │  • Manual location search input                          │   │
│  │  • Search results dropdown                               │   │
│  │  • Location selection                                    │   │
│  │  • Debounced search                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         LocationModal Component                          │   │
│  │         (components/LocationModal.tsx)                   │   │
│  │                                                           │   │
│  │  • Manual location search only                           │   │
│  │  • No auto-detection                                     │   │
│  │  • Delivery zone validation                              │   │
│  │  • Location selection confirmation                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         useDeliveryZone Hook                             │   │
│  │         (hooks/useDeliveryZone.ts)                       │   │
│  │                                                           │   │
│  │  • State Management                                      │   │
│  │  • Order Validation                                      │   │
│  │  • Distance Calculation                                  │   │
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
│  │  │  getCityFromCoordinates(lat, lng)                │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  OpenStreetMap Nominatim API (FREE!)             │   │   │
│  │  │  → Returns: "Jhang" or "Faisalabad" etc.         │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  calculateDistance(lat, lng)                     │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Haversine Formula (No API)                      │   │   │
│  │  │  → Returns: 4.2 (km) - Direct Distance           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  getOrderLimit(distanceKm)                        │   │   │
│  │  │  ↓                                                │   │   │
│  │  │  Rule Engine                                      │   │   │
│  │  │  → 0-3km: Rs. 0                                   │   │   │
│  │  │  → 3-5km: Rs. 0                                   │   │   │
│  │  │  → 5-10km: Rs. 2000                               │   │   │
│  │  │  → >10km: Not available                           │   │   │
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
│  │ Browser          │  │ OpenStreetMap    │  │ Leaflet.js   │  │
│  │ Geolocation      │  │ Nominatim API    │  │ Map Library  │  │
│  │ API              │  │ (Reverse Geo)    │  │ (Display)    │  │
│  │                  │  │                  │  │              │  │
│  │ Free             │  │ FREE (No limits) │  │ FREE         │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### Step-by-Step Process:

```
1. User Action
   └─> Type location in search input (e.g., "jhang")
       │
       ▼
2. Location Search (FREE - OpenStreetMap)
   └─> searchLocations(query)
       └─> OpenStreetMap Nominatim API
           └─> Returns: Array of location results
               │
               ▼
3. User Selection
   └─> User clicks on location from dropdown
       └─> Returns: { lat: 31.278, lng: 72.321, display_name: "Jhang Sadar" }
           │
           ▼
4. Distance Calculation (FREE - Haversine)
   └─> calculateDistance(lat, lng)
       └─> Haversine Formula (Pure Math)
           └─> Returns 4.2 km
               │
               ▼
5. City Detection (FREE - OpenStreetMap)
   └─> getCityFromCoordinates(lat, lng)
       └─> OpenStreetMap Nominatim API
           └─> Returns: "Jhang"
               │
               ▼
6. City Validation
   └─> isDeliveryAvailable("Jhang")
       └─> "Jhang" === deliveryCity?
           ├─> Yes ✅ Continue
           └─> No ❌ Show error: "Can't deliver to your location"
               │
               ▼
7. Order Limit Determination
   └─> getOrderLimit(4.2)
       └─> Check rules:
           ├─> 0-3 km? No
           ├─> 3-5 km? Yes ✅
           └─> Return: { minOrder: 0, message: "No minimum order" }
               │
               ▼
8. Display Results & Cart Integration
   └─> Show:
       ├─> City: "Jhang" ✅
       ├─> Distance: 4.2 km ✅
       ├─> Min Order: Rs. 0 ✅
       └─> Enable/Disable cart based on delivery availability ✅
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
│    │    │         ├─── Manual Location Search
│    │    │         │    ├─── LocationSearch Component
│    │    │         │    ├─── Search Input
│    │    │         │    ├─── Results Dropdown
│    │    │         │    └─── Location Selection
│    │    │         │
│    │    │         ├─── Results Display
│    │    │         │    ├─── Error Message (if any)
│    │    │         │    └─── Success Info Cards
│    │    │         │         ├─── City Card
│    │    │         │         ├─── Distance Card
│    │    │         │         └─── Order Limit Card
│    │    │         │
│    │    │         ├─── Leaflet Map (OpenStreetMap)
│    │    │         │    ├─── Restaurant Marker (🍽️)
│    │    │         │    ├─── User Marker (📍)
│    │    │         │    └─── Polyline (connecting line)
│    │    │         │
│    │    │         └─── Info Section
│    │    │              └─── Delivery Rules List
│    │    │
│    │    ├─── LocationModal Component ⭐
│    │    │    │
│    │    │    ├─── Manual location search only
│    │    │    ├─── LocationSearch Component
│    │    │    ├─── No auto-detection
│    │    │    └─── Delivery zone validation
│    │    │
│    │    └─── /checkout/page.tsx (Your Integration)
│    │         │
│    │         ├─── LocationSearch Component ⭐
│    │         │    ├─── Manual location search
│    │         │    ├─── Search results dropdown
│    │         │    └─── Location selection
│    │         │
│    │         └─── useDeliveryZone Hook ⭐
│    │              │
│    │              ├─── Order Validation
│    │              ├─── Distance Calculation
│    │              └─── State Management
│    │
│    └─── Footer
│
└─── Providers
     ├─── CartProvider (with delivery zone integration)
     └─── (LocationProvider removed - no auto-detection)
```

## 📦 File Dependencies

```
LocationSearch.tsx
├─── Imports:
│    ├─── React (useState, useCallback, useEffect, useRef)
│    │
│    └─── lib/deliveryZoneUtils.ts
│         ├─── searchLocations
│         ├─── calculateDistance
│         ├─── getOrderLimit
│         ├─── isDeliveryAvailable
│         └─── getCityFromCoordinates
│
└─── Dependencies:
     └─── OpenStreetMap Nominatim API (FREE)

CheckDeliveryZone.jsx
├─── Imports:
│    ├─── React (useState, useCallback)
│    ├─── dynamic (Next.js)
│    │    └─── LeafletMap (dynamic import)
│    │
│    └─── lib/deliveryZoneUtils.ts
│         ├─── RESTAURANT_COORDS
│         ├─── DELIVERY_CITY
│         ├─── calculateDistance
│         ├─── getCityFromCoordinates
│         ├─── getOrderLimit
│         ├─── isDeliveryAvailable
│         └─── OrderLimitRule (type)
│
└─── Dependencies:
     └─── leaflet (map library)
```

```
useDeliveryZone.ts (Hook)
├─── Imports:
│    ├─── React (useState, useCallback)
│    │
│    └─── lib/deliveryZoneUtils.ts
│         ├─── getUserLocation
│         ├─── getCityFromCoordinates
│         ├─── calculateDistance
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
No API Keys Required! 🎉
│
├─── OpenStreetMap Nominatim
│    └─── FREE public API
│         ├─> No authentication required
│         ├─> No rate limits for reasonable usage
│         └─> No billing or quotas
│
├─── Browser Geolocation
│    └─── User permission required
│         ├─> Secure HTTPS only
│         ├─> User controls access
│         └─> No data sent to external servers
│
└─── Leaflet.js Maps
     └─── Open-source library
          ├─> No API keys needed
          ├─> Uses OpenStreetMap tiles
          └─> Client-side only
```

## 📊 Performance Optimization

```
Performance Strategy
│
├─── Lazy Loading
│    └─> Map loads only when location detected
│         └─> Saves initial page load time
│
├─── FREE API Calls
│    ├─> OpenStreetMap Nominatim: No rate limits
│    ├─> Haversine calculation: Pure math (instant)
│    └─> No API key management needed
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
RESTAURANT_COORDS = { lat: 31.2681, lng: 72.3317 }
DELIVERY_CITY = "Jhang"
ORDER_LIMIT_RULES = [0-3km: Rs.0, 3-5km: Rs.0, 5-10km: Rs.2000, >10km: blocked]
```

### Key Functions:
```typescript
searchLocations(query) → Array<LocationResult>
getCityFromCoordinates(lat, lng) → "Jhang"
calculateDistance(lat, lng) → 4.2 (km)
getOrderLimit(distanceKm) → { minOrder: 0, ... }
isDeliveryAvailable(city) → true/false
isDeliveryAvailableByDistance(distanceKm) → true/false
validateOrderTotal(total, minOrder) → true/false
```

### Key Files:
- Search Component: `components/LocationSearch.tsx`
- Component: `components/CheckDeliveryZone.jsx`
- Modal: `components/LocationModal.tsx`
- Utilities: `lib/deliveryZoneUtils.ts`
- Hook: `hooks/useDeliveryZone.ts`
- Map: `components/LeafletMap.jsx`
- Demo: `app/delivery-zone/page.tsx`
- Cart Integration: `components/Cart/CartProvider.tsx`

---

**📖 For detailed implementation, see:**
- Architecture: This file
- Quick Start: `QUICK_START.md`
- Full Docs: `DELIVERY_ZONE_README.md`
- Checklist: `CHECKLIST.md`

---

**Built with ❤️ for The Pan N Grill**
