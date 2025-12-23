# Google Maps Setup Guide

## Why API Key in Both Places?

**`app.json`** - Required for native iOS/Android SDK initialization at **compile time**
**`.env`** - Required for JavaScript runtime (Directions API calls)

Both are necessary because:
- Native map rendering uses the app.json key
- JavaScript-based features (directions, geocoding) use the .env key

## Setup Steps

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Create API Key
4. Enable these APIs:
   - **Maps SDK for Android** (required)
   - **Maps SDK for iOS** (required)
   - **Directions API** (for routing)
   - **Places API** (for autocomplete - optional)

### 2. Add API Key to Config

**In `app.json`:**
```json
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_API_KEY_HERE"
  }
},
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY_HERE"
    }
  }
}
```

**In `.env`:**
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### 3. Restrict API Key (Production)

In Google Cloud Console → Credentials → Edit API Key:

**Android:**
- Restriction: Android apps
- Package name: `com.openride.app`
- SHA-1 certificate fingerprint: (get from `eas credentials`)

**iOS:**
- Restriction: iOS apps
- Bundle ID: `com.openride.app`

### 4. Rebuild Native Code

After adding API key:
```bash
npx expo prebuild --clean
npm run android  # or npm run ios
```

## Components Available

### GoogleMapsView (Basic)
```tsx
import { GoogleMapsView } from '@/components/map';

<GoogleMapsView
  latitude={6.5244}
  longitude={3.3792}
  markers={[...]}
  showUserLocation={true}
/>
```

### DirectionsMap (With Routing)
```tsx
import { DirectionsMap } from '@/components/map';

<DirectionsMap
  origin={{ latitude: 6.5244, longitude: 3.3792 }}
  destination={{ latitude: 6.4550, longitude: 3.3941 }}
  waypoints={[...]}
  onReady={(result) => console.log('Distance:', result.distance)}
/>
```

### RideMap (Live Driver Tracking)
```tsx
import { RideMap } from '@/components/map';

<RideMap
  userLocation={location}
  showDrivers={true}
/>
```

## Troubleshooting

**Map shows gray screen:**
- Check API key is added to both app.json and .env
- Verify APIs are enabled in Cloud Console
- Rebuild with `npx expo prebuild --clean`

**Directions not showing:**
- Ensure Directions API is enabled
- Check .env has EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
- Verify API key has no restrictions blocking Directions API

**"This API project is not authorized":**
- Add bundle ID / package name restrictions in Cloud Console
- Wait 5 minutes for restrictions to propagate
