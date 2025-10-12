# 🚚 Google Maps Delivery Zone Feature

> **A complete, production-ready delivery distance calculator with dynamic order limits for your Next.js restaurant website.**

![Status](https://img.shields.io/badge/status-ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Get Google Maps API Key
# Visit: https://console.cloud.google.com/
# See: GOOGLE_MAPS_SETUP.md

# 2. Configure Environment
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here" > .env.local

# 3. Update Restaurant Location (lib/deliveryZoneUtils.ts)
# RESTAURANT_COORDS = { lat: 31.277761, lng: 72.321373 }

# 4. Run Development Server
npm run dev

# 5. Test Feature
# Visit: http://localhost:3000/delivery-zone
```

**📖 Detailed Setup:** See [`QUICK_START.md`](./QUICK_START.md)

---

## 🎯 What Does This Do?

This feature allows your customers to:

1. **📍 Detect their location** using GPS
2. **🌍 See their city** automatically detected
3. **📏 View distance** from your restaurant
4. **💰 Know minimum order** requirements based on distance
5. **🗺️ See interactive map** with both locations
6. **❌ Get clear feedback** if outside delivery zone

### Business Rules:

- **0-2 km:** ✅ No minimum order
- **3-5 km:** ⚠️ Minimum Rs. 1,000
- **>5 km:** ⚠️ Minimum Rs. 1,500
- **Outside Jhang:** ❌ Delivery not available

---

## 🎨 Live Demo

Visit these pages after setup:

- **Standalone Demo:** `/delivery-zone`
- **Checkout Integration:** `/checkout-example`

### Screenshots:

**Location Detection:**
```
┌─────────────────────────────────────┐
│  🚚 Check Delivery Zone             │
├─────────────────────────────────────┤
│  Find out if we deliver to your     │
│  location and check minimum order   │
│                                      │
│  [📍 Detect My Location]             │
└─────────────────────────────────────┘
```

**Results Display:**
```
┌─────────────────────────────────────┐
│  📍 Your City        │ 📏 Distance   │
│  Jhang              │ 4.3 km        │
├─────────────────────┴────────────────┤
│  💰 Order Requirement                │
│  Minimum Order: Rs. 1000             │
│                                      │
│  ✅ Your order meets requirement!    │
│                                      │
│  [🗺️ Interactive Map]                │
│  [Restaurant] ---- 4.3km ---- [You] │
└─────────────────────────────────────┘
```

---

## 📦 What's Included

### Core Components:
- ✅ `CheckDeliveryZone` - Full-featured React component
- ✅ `useDeliveryZone` - Custom React hook for integration
- ✅ `deliveryZoneUtils` - Helper functions library

### Features:
- ✅ Browser geolocation integration
- ✅ Google Maps API integration (Geocoding, Distance Matrix)
- ✅ Haversine distance formula fallback
- ✅ Interactive map with markers and polyline
- ✅ Dynamic order limit rules
- ✅ City-based delivery validation
- ✅ Comprehensive error handling
- ✅ Loading states and UX feedback
- ✅ Mobile responsive design
- ✅ TypeScript support
- ✅ Testing utilities

### Documentation:
- 📖 Quick Start Guide
- 📖 Full Documentation
- 📖 Google Maps Setup Guide
- 📖 Architecture Overview
- 📖 Implementation Checklist
- 📖 Code Examples

---

## 🚀 Usage Examples

### Standalone Component

```tsx
import CheckDeliveryZone from '@/components/CheckDeliveryZone';

export default function DeliveryPage() {
  return (
    <div>
      <h1>Check Delivery Zone</h1>
      <CheckDeliveryZone />
    </div>
  );
}
```

### Checkout Integration with Hook

```tsx
'use client';

import { useDeliveryZone } from '@/hooks/useDeliveryZone';
import { useCart } from '@/components/Cart/CartProvider';

export default function CheckoutPage() {
  const { getTotalPrice } = useCart();
  const {
    distanceKm,
    orderRule,
    deliveryAllowed,
    loading,
    detectDeliveryZone,
    validateOrder
  } = useDeliveryZone();

  const cartTotal = getTotalPrice();
  const orderValidation = validateOrder(cartTotal);

  return (
    <div>
      {/* Step 1: Detect Location */}
      <button 
        onClick={detectDeliveryZone}
        disabled={loading}
      >
        {loading ? '🔄 Detecting...' : '📍 Detect My Location'}
      </button>

      {/* Step 2: Show Results */}
      {deliveryAllowed && orderRule && (
        <div>
          <p>Distance: {distanceKm} km</p>
          <p>Min Order: Rs. {orderRule.minOrder}</p>
          
          {!orderValidation.valid && (
            <p className="error">{orderValidation.message}</p>
          )}
        </div>
      )}

      {/* Step 3: Order Form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!orderValidation.valid) {
          alert(orderValidation.message);
          return;
        }
        // Submit order...
      }}>
        {/* Your form fields */}
        
        <button 
          type="submit"
          disabled={!orderValidation.valid}
        >
          Place Order - Rs. {cartTotal}
        </button>
      </form>
    </div>
  );
}
```

### Using Helper Functions

```tsx
import {
  calculateHaversineDistance,
  getOrderLimit,
  validateOrderTotal,
  RESTAURANT_COORDS
} from '@/lib/deliveryZoneUtils';

// Calculate distance
const distance = calculateHaversineDistance(
  userLat, userLng,
  RESTAURANT_COORDS.lat,
  RESTAURANT_COORDS.lng
);
// Returns: 4.3 (km)

// Get order rule
const rule = getOrderLimit(distance);
// Returns: { minOrder: 1000, message: "Min Rs. 1000", ... }

// Validate order
const isValid = validateOrderTotal(1500, rule.minOrder);
// Returns: true
```

---

## 🎨 Customization

### Change Order Limits

Edit `lib/deliveryZoneUtils.ts`:

```typescript
export const ORDER_LIMIT_RULES = [
  {
    minDistance: 0,
    maxDistance: 2,
    minOrder: 0,           // ← Change this
    message: 'Free delivery!',
    emoji: '✅'
  },
  // Add more rules...
];
```

### Update Restaurant Location

```typescript
export const RESTAURANT_COORDS = { 
  lat: 31.277761,  // ← Your latitude
  lng: 72.321373   // ← Your longitude
};
```

**How to find coordinates:**
- Google Maps → Right-click → Copy coordinates
- Or use: https://www.latlong.net/

### Change Delivery City

```typescript
export const DELIVERY_CITY = 'Jhang';  // ← Your city
```

---

## 🧪 Testing

### Browser Console Helpers

Open browser console (F12) and try:

```javascript
// Mock nearby location (< 2km)
window.testDeliveryZone.mockNearby()

// Mock medium distance (3-5km)
window.testDeliveryZone.mockMedium()

// Mock far location (> 5km)
window.testDeliveryZone.mockFar()

// Mock outside delivery zone
window.testDeliveryZone.mockOutside()

// Run all automated tests
window.testDeliveryZone.testAll()
```

### Manual Testing Checklist

- [ ] Test location detection
- [ ] Test with location permission denied
- [ ] Test with nearby location
- [ ] Test with medium distance
- [ ] Test with far location
- [ ] Test outside delivery city
- [ ] Test API fallback (disable API key)
- [ ] Test on mobile devices
- [ ] Test on different browsers

---

## 📚 Documentation Files

| File | Description | Use When |
|------|-------------|----------|
| **QUICK_START.md** | 5-minute setup guide | Just getting started |
| **GOOGLE_MAPS_SETUP.md** | Google Maps API setup | Need API key help |
| **DELIVERY_ZONE_README.md** | Complete documentation | Need full details |
| **ARCHITECTURE.md** | System architecture | Understanding structure |
| **CHECKLIST.md** | Implementation checklist | Tracking progress |
| **IMPLEMENTATION_SUMMARY.md** | Feature overview | Quick reference |

---

## 🏗️ Project Structure

```
components/
└── CheckDeliveryZone.tsx        ← Main UI component

lib/
├── deliveryZoneUtils.ts         ← Core utilities
└── deliveryZoneTestUtils.ts     ← Testing helpers

hooks/
└── useDeliveryZone.ts           ← React hook

app/
├── delivery-zone/page.tsx       ← Demo page
└── checkout-example/page.tsx    ← Integration example

Documentation/
├── QUICK_START.md
├── GOOGLE_MAPS_SETUP.md
├── DELIVERY_ZONE_README.md
├── ARCHITECTURE.md
├── CHECKLIST.md
└── IMPLEMENTATION_SUMMARY.md
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
# Required for full functionality
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here

# Optional (existing config)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google Cloud APIs

Enable these 3 APIs in Google Cloud Console:

1. ✅ **Maps JavaScript API** - For map display
2. ✅ **Geocoding API** - For city detection
3. ✅ **Distance Matrix API** - For distance calculation

**Free Tier:** $200/month credit (40,000 requests)

---

## 🔒 Security

### API Key Protection:

✅ **Environment variables only** - Never hardcode  
✅ **Domain restrictions** - Limit to your domains  
✅ **API restrictions** - Only enable needed APIs  
✅ **Git ignored** - `.env.local` not committed  
✅ **Billing alerts** - Prevent unexpected charges  

### Best Practices:

```typescript
// ✅ Correct - Using environment variable
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// ❌ Wrong - Never hardcode
const apiKey = "AIzaSyB...";
```

---

## 📊 Performance

- **Lazy Loading:** Map loads only when needed
- **Efficient APIs:** Single call per detection
- **Fallback Strategy:** Works without API key
- **Optimized Rendering:** Minimal re-renders
- **Mobile Friendly:** Responsive design

### API Usage Optimization:

- Geocoding: Only when API key available
- Distance Matrix: Optional (can toggle)
- Haversine: No API calls (mathematical)
- Caching: Can implement localStorage (optional)

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Supported |
| Firefox | 88+ | ✅ Supported |
| Safari | 14+ | ✅ Supported |
| Edge | 90+ | ✅ Supported |
| Mobile Safari | iOS 14+ | ✅ Supported |
| Chrome Mobile | Latest | ✅ Supported |

**Requirements:**
- HTTPS (or localhost)
- JavaScript enabled
- Geolocation API support

---

## 🐛 Troubleshooting

### Map Not Loading

**Check:**
1. API key is correct in `.env.local`
2. Maps JavaScript API is enabled
3. API key restrictions allow your domain
4. Browser console for specific errors

### Location Permission Denied

**Solution:**
1. Use HTTPS (required for geolocation)
2. Check browser location settings
3. Try incognito mode
4. Clear site data and retry

### Wrong Distance

**Solution:**
1. Verify restaurant coordinates
2. Toggle "Use Google Distance Matrix API"
3. Note: Haversine gives straight-line distance
4. Google API gives road distance

**Full Troubleshooting:** See `DELIVERY_ZONE_README.md`

---

## 💰 Cost Estimate

### Typical Small Restaurant:

- **Orders per month:** 1,000
- **API calls per order:** 3 (Geocoding + Distance + Maps)
- **Total API calls:** 3,000/month
- **Free tier:** 40,000/month
- **Cost:** **$0** ✅ (within free tier)

### Setting Up Billing Alerts:

1. Google Cloud Console → Billing
2. Create budget alert at $10
3. Get notified before charges

---

## 🎓 Learning Resources

### For Developers:

- **Google Maps API Docs:** https://developers.google.com/maps
- **Next.js Docs:** https://nextjs.org/docs
- **React Hooks Guide:** https://react.dev/reference/react

### In This Project:

- Code examples in `app/` folder
- Inline JSDoc comments
- TypeScript type definitions
- Testing utilities and mocks

---

## 🤝 Support & Help

### Getting Help:

1. **Check documentation** - See files above
2. **Review examples** - `/delivery-zone` and `/checkout-example`
3. **Browser console** - Check for error messages (F12)
4. **Google Cloud Console** - Verify API settings
5. **Test utilities** - Use `window.testDeliveryZone` helpers

### Common Questions:

**Q: Do I need a credit card for Google Maps API?**  
A: Yes, but the free tier ($200/month) covers most small sites.

**Q: Can it work without Google Maps API?**  
A: Yes! It uses Haversine formula for distance. Maps won't show.

**Q: How accurate is the distance?**  
A: Google API: Road distance (accurate). Haversine: Direct line (less accurate).

**Q: Can I change the order limits?**  
A: Yes! Edit `ORDER_LIMIT_RULES` in `lib/deliveryZoneUtils.ts`.

---

## 📞 Quick Reference

### Key Files:
- Component: `components/CheckDeliveryZone.tsx`
- Utilities: `lib/deliveryZoneUtils.ts`
- Hook: `hooks/useDeliveryZone.ts`
- Demo: `app/delivery-zone/page.tsx`

### Key Functions:
```typescript
getUserLocation()              // Get user's GPS location
getCityFromCoordinates()       // Lat/lng → City name
calculateHaversineDistance()   // Calculate distance
getOrderLimit()                // Distance → Order rule
isDeliveryAvailable()          // City → Allowed?
validateOrderTotal()           // Check minimum met
```

### Key Constants:
```typescript
RESTAURANT_COORDS              // Your restaurant location
DELIVERY_CITY                  // Your delivery city
ORDER_LIMIT_RULES              // Distance → Min order
```

---

## ✅ Checklist

Before going live:

- [ ] Google Maps API key configured
- [ ] Restaurant coordinates updated
- [ ] Delivery city set correctly
- [ ] Order limits customized
- [ ] Tested on development
- [ ] API key restrictions set
- [ ] Domain added to restrictions
- [ ] Billing alerts configured
- [ ] Mobile responsiveness verified
- [ ] Error handling tested

**Full Checklist:** See `CHECKLIST.md`

---

## 🎉 Ready to Launch?

You have everything you need:

✅ Complete component  
✅ Integration hook  
✅ Helper utilities  
✅ Testing tools  
✅ Full documentation  
✅ Live examples  
✅ Troubleshooting guide  

**Next Step:** Follow `QUICK_START.md` to set up in 5 minutes!

---

## 📄 License

This feature is part of The Pan N Grill Next.js project.

---

## 🙏 Acknowledgments

Built with:
- Next.js 14
- React 18
- TypeScript 5
- Google Maps APIs
- @react-google-maps/api
- Tailwind CSS

---

**🍕 Built with ❤️ for The Pan N Grill 🍔**

**Questions?** Check the documentation files listed above or review the code examples!

---

**Last Updated:** October 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
