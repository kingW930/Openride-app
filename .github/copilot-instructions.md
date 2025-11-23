# OpenRide Frontend - AI Agent Instructions

## Project Overview
OpenRide is a fixed-route carpooling platform with dual-role React Native apps (Rider/Driver) and Admin web dashboard. The frontend delivers real-time location tracking, seat booking with payment integration, QR ticketing, and offline-capable experiences.

## Architecture & Tech Stack

**Mobile (React Native + TypeScript + Expo)**
- **State Management**: Zustand (lightweight) + React Query (data fetching/caching)
- **Navigation**: React Navigation v6 (Stack + Tab + Modal)
- **Maps**: react-native-maps (Google Maps) with animated markers
- **Real-time**: socket.io-client for WebSocket connections
- **Location**: react-native-geolocation-service + background location worker
- **Storage**: react-native-keychain (JWT), SQLite/WatermelonDB (local cache)
- **Forms**: React Hook Form
- **Push**: @react-native-firebase/messaging
- **Observability**: Sentry for errors/crashes

**Monorepo Structure**
```
openride-app/                    # React Native app (single codebase, role-based features)
  app/                          # Expo Router screens
    auth/, rider/, driver/
  src/
    api/                        # API clients (axios + socket.io)
    components/                 # Reusable UI (map/, ride/, ui/)
    hooks/                      # useAuth, useLocation, useTrip
    services/                   # socket, location, permissions, notifications
    store/                      # Zustand stores (auth, rider, driver, trip)
    types/                      # TypeScript definitions
    utils/                      # formatters, mapUtils, storage
packages/                       # Shared types/UI (future)
apps/admin/                     # React web app (future)
```

## Critical Workflows

### Development Commands
```bash
cd openride-app
npm start                       # Start Expo dev server
npm run android                 # Run on Android
npm run ios                     # Run on iOS
```

### Build & Test (Per PRD)
- **Unit Tests**: Jest + React Native Testing Library (≥80% coverage for services)
- **E2E**: Detox for booking→payment→ticket→trip flows
- **CI/CD**: GitHub Actions with EAS Build or Fastlane

## Key Conventions & Patterns

### 1. Dual-Role Architecture
**Single codebase serves both Rider and Driver roles**. Check `authStore.user.role` to conditionally render screens/features:
```typescript
// Example: src/store/authStore.ts
const role = useAuthStore(state => state.user?.role); // 'rider' | 'driver'
```
- Riders: search routes, book seats, track driver, scan ticket QR
- Drivers: create routes, broadcast location, accept bookings, verify rider QR

### 2. API Integration (REST + WebSocket)
**Backend exposes OpenAPI-documented REST endpoints** (see PRD Section 6):
```typescript
// src/api/endpoints.ts
POST /v1/auth/send-otp          // { phone } → 200
POST /v1/auth/verify-otp        // { phone, code } → { token, user }
GET  /v1/routes?lat=&lng=       // → RouteSummary[]
POST /v1/bookings               // → { bookingId, paymentIntent }
POST /v1/payments/initiate      // → { widgetToken, paymentUrl }
GET  /v1/bookings/{id}/ticket   // → QR payload + signature
```

**WebSocket events** (socket.io):
```typescript
// Client emits
driver:online, driver:location, rider:subscribe, driver:checkin

// Server emits
booking:confirmed, driver:location, trip:update, payment:status
```

**Authentication**: JWT stored in Keychain, included in socket handshake auth query.

### 3. Real-time Location & Trip Tracking
**Driver Background Location** (PRD: <8% battery drain/hour):
- Use OS-native foreground service (Android) or background location updates (iOS)
- Batch location updates and throttle by `distanceFilter` (5-10m) + interval (3-5s)
- Emit `driver:location` events via WebSocket

**Rider Live Tracking** (PRD: <300ms latency):
- Subscribe to driver channel via `rider:subscribe { driverId }`
- Animate marker position using `AnimatedRegion` or manual interpolation
- Degrade to 5s polling if socket disconnects (show banner "Live tracking degraded")

**Example**:
```typescript
// src/components/map/RideMap.tsx
<MapView>
  <AnimatedMarker coordinate={driverPosition} />
  <Polyline coordinates={routePolyline} />
</MapView>
```

### 4. Booking & Payment Flow
**Seat Hold Mechanism** (Redis TTL ~10min):
1. `POST /v1/bookings` → creates PENDING booking + seat hold
2. Frontend shows hosted payment widget (Interswitch WebView)
3. On payment success (webhook), backend issues ticket → `GET /v1/bookings/{id}/ticket`
4. Display QR immediately with offline signature verification capability

**Error Handling**:
- Payment timeout → clear error, offer retry
- Seat hold expired → explain, offer rebook
- Use idempotency keys for retries

### 5. Offline & Resilience
**Offline QR Verification** (Drivers):
- Cache public key + minimal booking info for scheduled rides
- Verify ticket signature locally when offline
- Sync check-ins when reconnected

**Socket Reconnection**:
- Exponential backoff with jitter
- Queue important messages (e.g., accept booking) with idempotency
- Fallback to REST polling after N failed socket attempts

### 6. File Size & Modularity (Per constraints.md)
**No file >500-600 lines**. Split logically:
```
src/screens/rider/TripScreen.tsx        # Main screen component
src/components/ride/TripStatusCard.tsx  # Status display
src/services/location.ts                # Location logic
src/hooks/useTrip.ts                    # Trip state hook
```

### 7. TypeScript & Type Safety
**All models strongly typed** (mirror backend DTOs):
```typescript
// src/types/api.ts
interface User { id: string; name: string; phone: string; role: 'rider' | 'driver'; kycStatus: string; }
interface RouteSummary { id: string; driverId: string; stops: Stop[]; departureTime: string; seatsAvailable: number; price: number; }
interface Booking { id: string; routeId: string; status: BookingStatus; ticketId?: string; }
```

**Generate types from OpenAPI** when backend schemas are available.

### 8. Performance Targets (Frontend PRD Section 1)
- **Cold start**: <2s (first meaningful paint)
- **Search response**: <300ms perceived (<150ms backend target)
- **Driver location latency**: <300ms server→rider
- **Crash-free sessions**: >99.5%
- **Battery impact**: <8% drain/hour (driver background location)

**Optimization Strategies**:
- Cache expensive operations (route searches, ticket data)
- Minimize map tile requests
- Offload heavy processing (polyline decoding, signature verification) to worker threads
- Use React Query for background sync and stale-while-revalidate

### 9. Security Best Practices
- **Never store JWT in AsyncStorage** → use react-native-keychain
- **HTTPS everywhere** + TLS certificate pinning (optional for sensitive flows)
- **Redact PII** before logging to Sentry
- **Validate all user input** before API calls
- **Verify ticket signatures** using cached public key

### 10. Testing Requirements (PRD Section 12)
**Unit Tests** (Jest + React Native Testing Library):
```typescript
// src/services/__tests__/bookingService.test.ts
test('creates booking and reserves seat', async () => { ... });
```

**E2E Tests** (Detox):
```typescript
// e2e/booking-flow.e2e.ts
describe('Booking Flow', () => {
  it('should complete booking→payment→ticket flow', async () => {
    await element(by.id('search-input')).typeText('Ikeja');
    await element(by.id('route-card-1')).tap();
    await element(by.id('book-button')).tap();
    // ... payment widget → ticket QR
  });
});
```

**Mock socket events** for testing real-time flows.

## Component Patterns

### Reusable Components (PRD Section 4)
```typescript
// src/components/map/RideMap.tsx           → Map with clustering & animated markers
// src/components/ride/RideCard.tsx         → Route summary card
// src/components/ui/PaymentModal.tsx       → Hosted widget WebView wrapper
// src/components/ride/QRScanner.tsx        → QR scanner + local verification
// src/components/ride/RatingModal.tsx      → Post-trip rating UI
```

### Map Components
```typescript
// Always center on user/driver; provide "recenter" button after manual pan
<MapView region={region} onRegionChange={handlePan}>
  <AnimatedMarker coordinate={driverPos} image={require('./driver-icon.png')} />
  {route.stops.map(stop => <Marker key={stop.id} coordinate={stop} />)}
  <Polyline coordinates={polyline} strokeColor="#007AFF" strokeWidth={4} />
</MapView>
```

## Common Pitfalls

1. **Don't use AsyncStorage for JWT** → Use Keychain for secure token storage
2. **Don't forget idempotency** → Payment/booking APIs require idempotency keys
3. **Don't block main thread** → Offload signature verification, polyline decoding
4. **Don't over-poll map APIs** → Use server-provided ETA; cache tiles
5. **Don't ignore socket disconnects** → Implement reconnection + polling fallback
6. **Don't skip error boundaries** → Wrap screens in error boundaries for crash recovery

## Integration Points

**Backend Services** (see backend PRD):
- Auth Service (JWT + OTP)
- Booking Service (seat holds + ACID transactions)
- Payments Service (Interswitch hosted widget)
- Ticketing Service (QR + blockchain hash)
- Matchmaking Service (ML-ranked route suggestions)
- Notification Service (FCM push)

**External Dependencies**:
- Google Maps API (react-native-maps)
- Interswitch Payment Gateway (hosted widget)
- Firebase Cloud Messaging (push notifications)
- Sentry (error tracking)

## Edge Cases & Degradations

**No Network**:
- Show cached routes for scheduled rides
- Allow offline QR verification (signature check with cached public key)

**Socket Disconnects**:
- Switch to 5s polling for driver location
- Show banner: "Live tracking degraded — reconnecting…"

**Payment Timeouts**:
- Clear error message with retry CTA
- If seat-hold TTL lapses, explain and offer rebook

## Key Files to Reference

- **constraints.md**: Strict coding rules (file size, modularity, testing, security)
- **OpenRIDE — Frontend PRD & Technical.txt**: Full frontend specs (screens, APIs, performance targets)
- **OpenRide Unified Requirements Docum.txt**: End-to-end architecture (backend integration, matching logic)

## Next Steps for AI Agents

1. **Scaffold folder structure** per PRD Appendix 17 (app/, src/api, src/components, src/services, src/store)
2. **Generate typed API client** from backend OpenAPI spec
3. **Implement Auth flow** (OTP → JWT → Keychain storage → role routing)
4. **Build Map home screen** with socket mock harness for driver updates
5. **Integrate payment widget** (Interswitch sandbox) and ticket QR generation
6. **Add Sentry + analytics instrumentation**
7. **Create E2E test** for booking→payment→ticket→trip flow

---

**Remember**: This is a **dual-role app** (Rider/Driver in one codebase), prioritize **offline resilience**, enforce **strict file size limits** (<600 lines), and meet **performance targets** (cold start <2s, location latency <300ms).
