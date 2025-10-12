# 🗺️ Google Maps API Setup Guide

## Step-by-Step Guide to Get Your API Key

### Step 1: Go to Google Cloud Console

1. Visit: [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create a Project (If Needed)

1. Click the project dropdown at the top
2. Click "New Project"
3. Name it: "Pan N Grill Delivery"
4. Click "Create"

### Step 3: Enable Required APIs

You need to enable **3 APIs**:

#### 1. Maps JavaScript API

1. In the search bar, type: "Maps JavaScript API"
2. Click on "Maps JavaScript API"
3. Click "Enable"
4. Wait for it to enable (takes a few seconds)

#### 2. Geocoding API

1. In the search bar, type: "Geocoding API"
2. Click on "Geocoding API"
3. Click "Enable"
4. Wait for it to enable

#### 3. Distance Matrix API

1. In the search bar, type: "Distance Matrix API"
2. Click on "Distance Matrix API"
3. Click "Enable"
4. Wait for it to enable

### Step 4: Create API Key

1. Go to: **APIs & Services > Credentials**
2. Click "**+ Create Credentials**" at the top
3. Select "**API Key**"
4. Your API key will be created and displayed
5. **Copy this key!** (You'll need it in a moment)

### Step 5: Restrict Your API Key (IMPORTANT!)

⚠️ **Security Warning:** Unrestricted API keys can be stolen and abused, leading to unexpected charges!

#### Application Restrictions:

1. Click on your API key name in the Credentials page
2. Under "Application restrictions":
   - Select "**HTTP referrers (websites)**"
3. Click "**+ Add an item**"
4. Add these referrers:
   ```
   localhost:3000/*
   http://localhost:3000/*
   https://your-domain.com/*
   ```
   (Replace `your-domain.com` with your actual domain)

#### API Restrictions:

1. Scroll down to "API restrictions"
2. Select "**Restrict key**"
3. Choose **only these 3 APIs**:
   - Maps JavaScript API ✅
   - Geocoding API ✅
   - Distance Matrix API ✅
4. Click "Save"

### Step 6: Add API Key to Your Project

1. Open your project folder
2. Find the file: `.env.local`
3. Replace the placeholder with your actual API key:

```bash
# Before:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# After:
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyB...your-actual-key-here
```

4. Save the file
5. Restart your dev server:
   ```bash
   npm run dev
   ```

### Step 7: Test It!

1. Visit: `http://localhost:3000/delivery-zone`
2. Click "Detect My Location"
3. Allow location access
4. You should see:
   - Your city name ✅
   - Distance to restaurant ✅
   - Order limit info ✅
   - Interactive map ✅

---

## 🎯 Quick Checklist

Before you start, make sure you have:

- [ ] Google account
- [ ] Credit card added to Google Cloud (required, but free tier is generous)
- [ ] Project created
- [ ] Maps JavaScript API enabled
- [ ] Geocoding API enabled
- [ ] Distance Matrix API enabled
- [ ] API key created
- [ ] API key restrictions set
- [ ] API key added to `.env.local`
- [ ] Dev server restarted

---

## 💰 Pricing Information

Google Maps offers a **generous free tier**:

### Free Monthly Credits: $200

This gives you:

- **Maps JavaScript API:** 28,500 loads/month free
- **Geocoding API:** 40,000 requests/month free
- **Distance Matrix API:** 40,000 elements/month free

### What Does This Mean?

For a small restaurant website:
- ~1,000 orders/month
- Each order checks location once
- **Total cost:** $0 (well within free tier!)

### For Higher Traffic:

If you exceed the free tier:
- Maps JavaScript API: $7 per 1,000 loads
- Geocoding API: $5 per 1,000 requests
- Distance Matrix API: $5 per 1,000 elements

**Pro Tip:** Set up billing alerts in Google Cloud to get notified before charges occur.

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Always restrict your API key** to specific domains
2. **Only enable the APIs you need** (our 3 APIs)
3. **Use environment variables** (never hardcode in code)
4. **Keep `.env.local` in `.gitignore`** (never commit to GitHub)
5. **Set up billing alerts** in Google Cloud
6. **Regenerate key if exposed** (and update restrictions)

### ❌ DON'T:

1. ❌ Leave API key unrestricted
2. ❌ Commit API key to GitHub/Git
3. ❌ Share API key publicly
4. ❌ Enable unnecessary APIs
5. ❌ Use same key for multiple projects

---

## 🐛 Troubleshooting

### "This API key is not authorized to use this service or API"

**Solution:**
1. Check that all 3 APIs are enabled in Google Cloud
2. Wait a few minutes after enabling (can take up to 5 minutes)
3. Clear browser cache and retry
4. Verify API restrictions include the correct APIs

### "RefererNotAllowedMapError"

**Solution:**
1. Check API key restrictions
2. Make sure `localhost:3000/*` is in HTTP referrers
3. Remove any trailing slashes or extra characters
4. Save restrictions and wait 5 minutes

### "REQUEST_DENIED" in API responses

**Solution:**
1. Check billing is enabled on your Google Cloud project
2. Verify credit card is added (required even for free tier)
3. Check API key restrictions allow the specific API
4. Try creating a new API key

### Map shows "For development purposes only" watermark

**Solution:**
1. This means billing is not enabled
2. Go to Google Cloud Console
3. Enable billing (add credit card)
4. Even though it asks for a card, free tier is generous
5. Set up billing alerts to avoid charges

### API key not working in production

**Solution:**
1. Add your production domain to HTTP referrers:
   ```
   https://yourdomain.com/*
   https://www.yourdomain.com/*
   ```
2. Save restrictions
3. Wait 5 minutes for changes to propagate
4. Test again

---

## 📊 Monitoring Usage

### How to Check API Usage:

1. Go to Google Cloud Console
2. Navigate to: **APIs & Services > Dashboard**
3. View traffic for each API
4. Set up quotas and alerts

### Recommended Quotas:

Set these to protect yourself:

1. **Maps JavaScript API:** Limit to 10,000 requests/day
2. **Geocoding API:** Limit to 5,000 requests/day
3. **Distance Matrix API:** Limit to 5,000 requests/day

### Setting Up Billing Alerts:

1. Go to **Billing > Budgets & alerts**
2. Create a budget
3. Set amount: $10 (or whatever you're comfortable with)
4. Set alert at: 50%, 90%, 100%
5. Add your email

---

## 🎓 Understanding API Usage

### When APIs Are Called:

1. **Maps JavaScript API:**
   - When map is loaded (once per session)
   - Only after user clicks "Detect My Location"

2. **Geocoding API:**
   - Once per location detection
   - To get city name from coordinates

3. **Distance Matrix API:**
   - Once per location detection (if enabled)
   - Alternative: Use Haversine formula (no API call)

### Optimizations Built-In:

✅ **Lazy Loading:** Map only loads when needed  
✅ **Single Calls:** APIs called once per location check  
✅ **Fallback:** Haversine formula if API fails (no extra cost)  
✅ **Caching:** You can add localStorage caching (optional)  

---

## 🔗 Useful Links

- **Google Cloud Console:** https://console.cloud.google.com/
- **API Key Management:** https://console.cloud.google.com/apis/credentials
- **Billing:** https://console.cloud.google.com/billing
- **API Documentation:** https://developers.google.com/maps/documentation
- **Pricing Calculator:** https://cloud.google.com/products/calculator

---

## 📞 Need Help?

### Common Issues:

1. **Can't see APIs to enable**
   → Make sure you've selected the right project from dropdown

2. **API key created but not working**
   → Wait 5 minutes, clear browser cache, try again

3. **Billing issues**
   → Check that credit card is valid and billing is enabled

4. **Still stuck?**
   → Check error in browser console (F12)
   → Look for specific error message
   → Search error message in Google

---

## ✅ Final Verification

To verify everything is working:

```bash
# 1. Check API key is set
cat .env.local | grep GOOGLE_MAPS

# 2. Should show your key (not placeholder)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...

# 3. Start dev server
npm run dev

# 4. Visit test page
# http://localhost:3000/delivery-zone

# 5. Open browser console (F12)
# Look for any errors

# 6. Click "Detect My Location"
# Should work without errors!
```

---

**🎉 Congratulations!** You're now ready to use the Delivery Zone feature!

**Questions?** Check `QUICK_START.md` or `DELIVERY_ZONE_README.md` for more details.

---

**Built with ❤️ for The Pan N Grill**
