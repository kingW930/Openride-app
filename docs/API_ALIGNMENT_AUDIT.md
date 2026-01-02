# API Alignment Audit Report

## Summary

This document summarizes all the API alignment fixes made between the frontend (React Native) and backend (Java + Python) services.

## Architecture Overview

The backend is split across two deployments:
- **Java Backend** (`openride-java.solivolt.live`): Auth, Users, Bookings, Payments, Payouts, Ticketing, Admin
- **Python Backend** (`openride-python.solivolt.live`): Routes, Fleet, Matchmaking, Search, Notifications, Analytics

## Frontend API File → Backend Service Mapping

| Frontend API File | Backend Service | Axios Instance |
|-------------------|-----------------|----------------|
| `auth.ts` | Java Auth Service | `axiosInstance` |
| `user.ts` | Java User Service | `axiosInstance` |
| `verification.ts` | Java User Service | `axiosInstance` |
| `payment.ts` | Java Payments Service | `axiosInstance` |
| `payouts.ts` | Java Payouts Service | `axiosInstance` |
| `rider.ts` (bookings) | Java Booking Service | `axiosInstance` |
| `rider.ts` (search) | Python Search Service | `pythonAxiosInstance` |
| `driver.ts` (routes) | Python Routes Service | `pythonAxiosInstance` |
| `driver.ts` (fleet) | Python Fleet Service | `pythonAxiosInstance` |
| `driver.ts` (bookings) | Java Booking Service | `axiosInstance` |
| `trips.ts` | Python Fleet Service | `pythonAxiosInstance` |
| `matchmaking.ts` | Python Matchmaking Service | `pythonAxiosInstance` |
| `locations.ts` | Python Search Service | `pythonAxiosInstance` |
| `notifications.ts` | Python Notification Service | `pythonAxiosInstance` |

---

## Fixes Applied

### 1. Auth API Alignment

#### Frontend: `src/api/endpoints.ts`
- **Fixed**: Changed `REFRESH_TOKEN` from `/v1/auth/refresh` to `/v1/auth/refresh-token`

#### Frontend: `src/api/auth.ts`
- **Fixed**: Updated `sendOTP` and `verifyOTP` to unwrap `ApiResponse<T>` wrapper
- **Fixed**: Updated `refreshToken` return type to only return `{ accessToken: string }` (not both tokens)

#### Backend: `AuthResponse.java`
- **Added fields to UserInfo**:
  - `kycStatus: String`
  - `rating: BigDecimal`
  - `isActive: boolean`
  - `createdAt: LocalDateTime`
  - `updatedAt: LocalDateTime`
- **Added to AuthResponse**: `isNewUser: boolean`

#### Backend: `SendOtpResponse.java`
- **Added**: `success: boolean` field

#### Backend: `AuthService.java`
- **Updated**: `sendOtp()` to return `success: true`
- **Updated**: `mapToUserInfo()` to populate new fields from User Service response

---

### 2. Verification API Alignment

#### Frontend: `src/api/verification.ts`
- **Fixed all 9 endpoints**: Removed `/user` prefix
- Changed from `/user/v1/verification/...` to `/v1/verification/...`

#### Frontend: `src/types/user.ts`
- **Updated `VerificationStatusResponse`**:
  - Changed `overallStatus` → `kycStatus`
  - Added `statusMessage` field
  - Updated nested status interfaces

---

### 3. User API Alignment

#### Frontend: `src/api/user.ts`
- **Fixed**: `upgradeToDriver` → `upgradeToCaptain` with `/v1/users/upgrade-to-captain`
- **Fixed**: `submitKYCDocuments` uses `/v1/captains/kyc-documents`
- **Fixed**: `getKYCStatus` uses `captainProfile`

---

### 4. Payouts API Alignment

#### Backend: `BankAccountController.java`
- **Fixed**: Changed path from `/v1/bank-accounts` to `/v1/payouts/bank-accounts`

#### Backend: `WalletController.java`
- **Fixed**: Changed path from `/v1/earnings` to `/v1/payouts`
- **Fixed**: Renamed `/wallet` → `/balance`, `/summary` → `/earnings`

---

### 5. Dual-Backend Axios Setup

#### Frontend: `src/api/axiosInstance.ts`
- **Added**: `pythonAxiosInstance` export for Python backend services
- Both instances share the same auth token interceptor logic

---

### 6. Service Routing Updates

#### Frontend: `src/api/driver.ts`
- **Updated to use `pythonAxiosInstance`**:
  - `createRoute`, `getDriverRoutes`, `getRouteHistory`, `deleteRoute` (Routes)
  - `setOnlineStatus`, `updateDriverLocation`, `setDestination`, `clearDestination` (Fleet)
- **Kept on Java `axiosInstance`**:
  - `getDriverBookings`, `acceptBooking`, `rejectBooking`, `checkInPassenger`, `startTrip` (Bookings)

#### Frontend: `src/api/trips.ts`
- **Updated all functions to use `pythonAxiosInstance`**:
  - `startTrip`, `getTrip`, `getActiveTrip`, `updateTripLocation`
  - `arrivedAtPickup`, `completeTrip`, `cancelTrip`
  - `rateTrip`, `getTripHistory`, `triggerSOS`

#### Frontend: `src/api/matchmaking.ts`
- **Updated all functions to use `pythonAxiosInstance`**:
  - `findDrivers`, `findRiders`, `getRouteSuggestions`

#### Frontend: `src/api/notifications.ts`
- **Updated all functions to use `pythonAxiosInstance`**:
  - `registerDevice`, `getNotifications`, `markNotificationRead`
  - `markAllRead`, `updateNotificationSettings`

#### Frontend: `src/api/locations.ts`
- **Updated all backend API functions to use `pythonAxiosInstance`**:
  - `searchLocationsAPI`, `reverseGeocodeAPI`
  - `getMeetingPointsAPI`, `getPopularLocationsAPI`

#### Frontend: `src/api/rider.ts`
- **Updated to use `pythonAxiosInstance`**:
  - `searchRoutes`, `advancedSearch` (Search)
  - `rateTrip` (Trips)
- **Kept on Java `axiosInstance`**:
  - `createBooking`, `getBookingDetails`, `getTicket`, `cancelBooking`
  - `getActiveBookings`, `getBookingHistory` (Bookings)

---

## Endpoint Summary

### Java Backend Endpoints (axiosInstance)

| Service | Endpoint Pattern | Description |
|---------|-----------------|-------------|
| Auth | `/v1/auth/*` | OTP, verification, tokens |
| Users | `/v1/users/*` | Profile, upgrade to captain |
| Captains | `/v1/captains/*` | KYC documents, verification |
| Verification | `/v1/verification/*` | Identity, license, vehicle |
| Bookings | `/v1/bookings/*` | Create, cancel, manage |
| Payments | `/v1/payments/*` | Initiate, verify, refund |
| Payouts | `/v1/payouts/*` | Balance, earnings, bank accounts |

### Python Backend Endpoints (pythonAxiosInstance)

| Service | Endpoint Pattern | Description |
|---------|-----------------|-------------|
| Routes | `/v1/routes/*` | Create, search, manage routes |
| Fleet | `/v1/fleet/*` | Driver status, location, availability |
| Trips | `/v1/trips/*` | Start, complete, rate trips |
| Matchmaking | `/v1/matchmaking/*` | Find drivers, riders, suggestions |
| Search | `/v1/search/*` | Advanced route search |
| Locations | `/v1/locations/*` | Geocoding, meeting points |
| Notifications | `/v1/notifications/*` | Push, in-app notifications |

---

## Configuration

### Environment Variables Required

```env
# Java Backend
EXPO_PUBLIC_JAVA_API_URL=https://openride-java.solivolt.live

# Python Backend  
EXPO_PUBLIC_PYTHON_API_URL=https://openride-python.solivolt.live
```

---

## Testing Checklist

- [ ] Auth flow (login/OTP) works with Java backend
- [ ] User profile and upgrade work with Java backend
- [ ] Verification/KYC works with Java backend
- [ ] Booking creation works with Java backend
- [ ] Payment initiation works with Java backend
- [ ] Payout requests work with Java backend
- [ ] Route search works with Python backend
- [ ] Trip management works with Python backend
- [ ] Matchmaking works with Python backend
- [ ] Notifications work with Python backend
- [ ] Location services work with Python backend

---

## Date

Audit completed: $(date)
