# OpenRide API Documentation for Backend Developer

This document outlines ALL API endpoints that the backend needs to implement for the OpenRide mobile application to be fully functional.

## Table of Contents
1. [API Configuration](#api-configuration)
2. [Authentication Endpoints](#authentication-endpoints)
3. [User & Profile Endpoints](#user--profile-endpoints)
4. [Location & Geocoding Endpoints](#location--geocoding-endpoints)
5. [Route Endpoints](#route-endpoints)
6. [Booking Endpoints](#booking-endpoints)
7. [Payment Endpoints](#payment-endpoints)
8. [Trip Endpoints](#trip-endpoints)
9. [Driver Endpoints](#driver-endpoints)
10. [Matchmaking Endpoints](#matchmaking-endpoints)
11. [Notification Endpoints](#notification-endpoints)
12. [WebSocket Events](#websocket-events)
13. [Data Models](#data-models)

---

## API Configuration

```
Base URL: {API_BASE_URL}/api/v1
Socket URL: {SOCKET_URL}

All endpoints require Bearer token authentication unless marked as public.
Content-Type: application/json
```

### Environment Variables (Frontend)
```bash
EXPO_PUBLIC_API_URL=https://api.openride.com/api
EXPO_PUBLIC_SOCKET_URL=https://api.openride.com
```

---

## Authentication Endpoints

### 1. Send OTP (Public)
```
POST /v1/auth/send-otp

Request:
{
  "phone": "+2348012345678"
}

Response (200):
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300  // seconds
}

Response (429 - Rate Limited):
{
  "success": false,
  "error": "Too many requests. Try again in 60 seconds"
}
```

### 2. Verify OTP (Public)
```
POST /v1/auth/verify-otp

Request:
{
  "phone": "+2348012345678",
  "code": "123456"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_123",
    "phone": "+2348012345678",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "rider",
    "avatar": "https://...",
    "rating": 4.8,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "isNewUser": false
}

Response (401):
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

### 3. Register User (Public)
```
POST /v1/auth/register

Request:
{
  "phone": "+2348012345678",
  "name": "John Doe",
  "email": "john@example.com",  // optional
  "role": "rider"  // or "driver"
}

Response (201):
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 4. Refresh Token
```
POST /v1/auth/refresh

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 5. Logout
```
POST /v1/auth/logout

Response (200):
{
  "success": true
}
```

### 6. Get Current User
```
GET /v1/auth/me

Response (200):
{
  "user": { ... }
}
```

---

## Location & Geocoding Endpoints

### 1. Search Locations
```
GET /v1/locations/search?query=victoria+island&lat=6.5244&lng=3.3792

Response (200):
{
  "results": [
    {
      "id": "place_123",
      "name": "Victoria Island",
      "address": "Victoria Island, Lagos, Nigeria",
      "latitude": 6.4281,
      "longitude": 3.4219,
      "type": "locality"
    }
  ]
}
```

### 2. Reverse Geocode
```
GET /v1/locations/reverse?lat=6.5244&lng=3.3792

Response (200):
{
  "address": "123 Allen Avenue, Ikeja, Lagos, Nigeria",
  "street": "Allen Avenue",
  "city": "Ikeja",
  "state": "Lagos",
  "country": "Nigeria",
  "postcode": "100001"
}
```

### 3. Get Meeting Points (Smart pickup locations)
```
GET /v1/locations/meeting-points?lat=6.5244&lng=3.3792&destLat=6.4281&destLng=3.4219

Response (200):
{
  "meetingPoints": [
    {
      "id": "mp_001",
      "name": "Sabo Bus Stop",
      "type": "bus_stop",
      "latitude": 6.5200,
      "longitude": 3.3800,
      "address": "Sabo, Yaba",
      "distanceFromUser": 500,
      "walkingTime": 6,
      "isOnRoute": true
    }
  ]
}

Note: Backend should find points that are:
1. Within 3km of user location
2. Along the route to destination (within 1km corridor)
3. Prioritize bus stops, T-junctions, and landmarks
```

### 4. Get Popular Locations
```
GET /v1/locations/popular?lat=6.5244&lng=3.3792

Response (200):
{
  "locations": [
    {
      "id": "pop_001",
      "name": "Ikeja City Mall",
      "address": "Obafemi Awolowo Way, Ikeja",
      "latitude": 6.6018,
      "longitude": 3.3515,
      "searchCount": 1500
    }
  ]
}
```

---

## Route Endpoints

### 1. Create Route (Driver)
```
POST /v1/routes

Request:
{
  "origin": {
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "Yaba, Lagos",
    "name": "Home"
  },
  "destination": {
    "latitude": 6.4281,
    "longitude": 3.4219,
    "address": "Victoria Island, Lagos",
    "name": "Work"
  },
  "stops": [
    {
      "name": "Sabo Bus Stop",
      "lat": 6.5200,
      "lng": 3.3800,
      "order": 1
    }
  ],
  "departureTime": "2024-12-08T08:00:00Z",
  "seatsAvailable": 3,
  "pricePerSeat": 1500,
  "vehicleId": "veh_123",
  "isRecurring": true,
  "recurringDays": [1, 2, 3, 4, 5]  // Monday-Friday
}

Response (201):
{
  "route": {
    "id": "route_123",
    "driverId": "driver_123",
    "driver": { ... },
    "origin": { ... },
    "destination": { ... },
    "stops": [ ... ],
    "departureTime": "2024-12-08T08:00:00Z",
    "estimatedArrivalTime": "2024-12-08T08:45:00Z",
    "seatsAvailable": 3,
    "totalSeats": 4,
    "pricePerSeat": 1500,
    "distance": 15.5,
    "duration": 45,
    "polyline": "encoded_polyline_string",
    "status": "SCHEDULED",
    "createdAt": "2024-12-08T00:00:00Z"
  }
}
```

### 2. Search Routes (Rider)
```
GET /v1/routes/search?pickupLat=6.5244&pickupLng=3.3792&destLat=6.4281&destLng=3.4219&seats=1&date=2024-12-08

Response (200):
{
  "routes": [
    {
      "id": "route_123",
      "driver": {
        "id": "driver_123",
        "name": "John Driver",
        "rating": 4.8,
        "totalTrips": 150,
        "avatar": "https://...",
        "vehicle": {
          "make": "Toyota",
          "model": "Camry",
          "color": "Silver",
          "licensePlate": "ABC-123XY"
        }
      },
      "origin": { ... },
      "destination": { ... },
      "departureTime": "2024-12-08T08:00:00Z",
      "seatsAvailable": 2,
      "pricePerSeat": 1500,
      "distance": 15.5,
      "duration": 45,
      "status": "SCHEDULED"
    }
  ]
}
```

### 3. Get Route Details
```
GET /v1/routes/:id

Response (200):
{
  "route": { ... full route object ... }
}
```

### 4. Get Driver's Active Routes
```
GET /v1/routes/driver/active

Response (200):
{
  "routes": [ ... ]
}
```

---

## Booking Endpoints

### 1. Create Booking (Rider)
```
POST /v1/bookings

Request:
{
  "routeId": "route_123",
  "seats": 1,
  "pickupPoint": {
    "latitude": 6.5200,
    "longitude": 3.3800,
    "address": "Sabo Bus Stop, Yaba",
    "name": "Sabo Bus Stop"
  },
  "dropoffPoint": {
    "latitude": 6.4281,
    "longitude": 3.4219,
    "address": "Victoria Island, Lagos",
    "name": "Victoria Island"
  },
  "idempotencyKey": "uuid-v4-here"
}

Response (201):
{
  "booking": {
    "id": "booking_123",
    "routeId": "route_123",
    "riderId": "rider_123",
    "driverId": "driver_123",
    "seats": 1,
    "pickupPoint": { ... },
    "dropoffPoint": { ... },
    "status": "PENDING",
    "totalPrice": 1500,
    "createdAt": "2024-12-08T07:00:00Z",
    "expiresAt": "2024-12-08T07:10:00Z"  // 10 min seat hold
  },
  "paymentIntent": {
    "id": "pi_123",
    "amount": 1500,
    "currency": "NGN",
    "expiresAt": "2024-12-08T07:10:00Z"
  }
}

Note: Seat should be held for 10 minutes using Redis TTL
```

### 2. Get Booking Details
```
GET /v1/bookings/:id

Response (200):
{
  "booking": { ... }
}
```

### 3. Cancel Booking
```
POST /v1/bookings/:id/cancel

Request:
{
  "reason": "Changed plans"
}

Response (200):
{
  "booking": { ...updated booking with status CANCELLED... },
  "refundAmount": 1350  // If eligible for refund
}
```

### 4. Get Ticket
```
GET /v1/bookings/:id/ticket

Response (200):
{
  "ticket": {
    "id": "ticket_123",
    "bookingId": "booking_123",
    "qrCode": "BASE64_QR_DATA",
    "qrCodeImage": "data:image/png;base64,...",
    "signature": "HMAC_SHA256_SIGNATURE",
    "publicKey": "-----BEGIN PUBLIC KEY-----...",
    "expiresAt": "2024-12-08T12:00:00Z",
    "issuedAt": "2024-12-08T07:05:00Z",
    "isUsed": false
  }
}

Note: QR should contain:
{
  "ticketId": "ticket_123",
  "bookingId": "booking_123",
  "riderId": "rider_123",
  "seats": 1,
  "timestamp": 1702022700000,
  "signature": "..."
}
```

### 5. Verify Ticket (Driver scans)
```
POST /v1/bookings/:id/verify-ticket

Request:
{
  "qrData": "{ JSON from QR scan }",
  "signature": "signature_from_qr"
}

Response (200):
{
  "valid": true,
  "booking": { ... },
  "message": "Ticket verified successfully"
}

Response (400):
{
  "valid": false,
  "message": "Ticket already used" | "Ticket expired" | "Invalid signature"
}
```

### 6. Accept Booking (Driver)
```
POST /v1/bookings/:id/accept

Response (200):
{
  "booking": { ...status: ACCEPTED... }
}
```

### 7. Reject Booking (Driver)
```
POST /v1/bookings/:id/reject

Request:
{
  "reason": "Route changed"
}

Response (200):
{
  "success": true
}
```

### 8. Check-in Rider (Driver)
```
POST /v1/bookings/:id/checkin

Request:
{
  "qrData": "{ scanned QR data }"
}

Response (200):
{
  "booking": { ...status: CHECKED_IN... }
}
```

### 9. Get Rider's Active Bookings
```
GET /v1/bookings/rider/active

Response (200):
{
  "bookings": [ ... ]
}
```

### 10. Get Rider's Booking History
```
GET /v1/bookings/rider/history?page=1&limit=20

Response (200):
{
  "bookings": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Payment Endpoints

### 1. Initiate Payment
```
POST /v1/payments/initiate

Request:
{
  "bookingId": "booking_123",
  "amount": 1500,
  "currency": "NGN",
  "idempotencyKey": "uuid-v4-here"
}

Response (200):
{
  "paymentId": "pay_123",
  "widgetToken": "interswitch_widget_token",
  "paymentUrl": "https://payment.interswitch.com/...",
  "expiresAt": "2024-12-08T07:10:00Z"
}

Note: Integrate with Interswitch hosted payment widget
```

### 2. Get Payment Status
```
GET /v1/payments/:id/status

Response (200):
{
  "status": "SUCCESS",
  "transaction": {
    "id": "pay_123",
    "amount": 1500,
    "currency": "NGN",
    "status": "SUCCESS",
    "provider": "interswitch",
    "transactionRef": "TXN_123456",
    "completedAt": "2024-12-08T07:02:00Z"
  }
}
```

### 3. Verify Payment
```
POST /v1/payments/:id/verify

Request:
{
  "transactionRef": "TXN_123456"
}

Response (200):
{
  "verified": true,
  "payment": { ... },
  "ticket": { ... }  // Automatically generate ticket on successful payment
}
```

---

## Trip Endpoints

### 1. Start Trip (Driver)
```
POST /v1/trips/start

Request:
{
  "routeId": "route_123"
}

Response (200):
{
  "trip": {
    "id": "trip_123",
    "routeId": "route_123",
    "driverId": "driver_123",
    "status": "IN_PROGRESS",
    "startedAt": "2024-12-08T08:00:00Z",
    "bookings": [ ... ]
  }
}
```

### 2. Get Active Trip
```
GET /v1/trips/active

Response (200):
{
  "trip": { ... } | null
}
```

### 3. Update Trip Location (Driver)
```
POST /v1/trips/:id/location

Request:
{
  "lat": 6.5244,
  "lng": 3.3792,
  "heading": 180,
  "speed": 45,
  "timestamp": 1702022700000
}

Response (200):
{
  "success": true
}

Note: Also broadcast via WebSocket to subscribed riders
```

### 4. Arrived at Pickup
```
POST /v1/trips/:id/arrived-pickup

Request:
{
  "stopId": "stop_123"
}

Response (200):
{
  "trip": { ... }
}

Note: Notify riders waiting at this stop via push notification
```

### 5. Complete Trip
```
POST /v1/trips/:id/complete

Response (200):
{
  "trip": { ...status: COMPLETED... },
  "earnings": 4500  // Total earnings from all bookings
}
```

### 6. Cancel Trip
```
POST /v1/trips/:id/cancel

Request:
{
  "reason": "Emergency"
}

Response (200):
{
  "trip": { ...status: CANCELLED... }
}

Note: Process refunds for affected bookings
```

### 7. Rate Trip
```
POST /v1/trips/:id/rate

Request:
{
  "rating": 5,
  "comment": "Great driver, very punctual!",
  "badges": ["punctual", "friendly", "clean_car"]
}

Response (200):
{
  "success": true
}
```

### 8. SOS Emergency
```
POST /v1/trips/:id/sos

Request:
{
  "location": {
    "latitude": 6.5244,
    "longitude": 3.3792
  },
  "message": "Need help!",
  "contactEmergencyServices": true
}

Response (200):
{
  "sosId": "sos_123",
  "emergencyContacted": true,
  "supportTicketId": "ticket_456"
}

Note: Alert admin dashboard immediately
```

---

## Driver Endpoints

### 1. Set Online/Offline Status
```
POST /v1/driver/status

Request:
{
  "isOnline": true
}

Response (200):
{
  "status": "online"
}
```

### 2. Update Location
```
POST /v1/driver/location

Request:
{
  "lat": 6.5244,
  "lng": 3.3792,
  "heading": 180,
  "speed": 0
}

Response (200):
{
  "success": true
}
```

### 3. Set Destination
```
POST /v1/driver/destination

Request:
{
  "lat": 6.4281,
  "lng": 3.4219,
  "address": "Victoria Island, Lagos"
}

Response (200):
{
  "destination": { ... },
  "matchingRiders": 5  // Number of riders heading same direction
}
```

### 4. Clear Destination
```
DELETE /v1/driver/destination

Response (200):
{
  "success": true
}
```

### 5. Get Earnings
```
GET /v1/driver/earnings?period=weekly

Response (200):
{
  "earnings": {
    "period": "weekly",
    "total": 45000,
    "trips": 30,
    "tips": 3000,
    "bonuses": 2000,
    "deductions": 5000,
    "netEarnings": 45000,
    "breakdown": [
      { "date": "2024-12-02", "amount": 6500, "trips": 4 },
      { "date": "2024-12-03", "amount": 7200, "trips": 5 }
    ]
  }
}
```

### 6. Get Driver Stats
```
GET /v1/driver/stats

Response (200):
{
  "stats": {
    "totalTrips": 150,
    "totalDistance": 2500,
    "totalEarnings": 450000,
    "rating": 4.85,
    "totalRatings": 142,
    "acceptanceRate": 92,
    "cancellationRate": 3,
    "onlineHours": 450,
    "memberSince": "2024-01-15T00:00:00Z"
  }
}
```

---

## Matchmaking Endpoints

### 1. Find Drivers (Rider)
```
POST /v1/match/find-drivers

Request:
{
  "pickupLat": 6.5244,
  "pickupLng": 3.3792,
  "destLat": 6.4281,
  "destLng": 3.4219,
  "seats": 1,
  "departureTime": "2024-12-08T08:00:00Z"
}

Response (200):
{
  "drivers": [
    {
      "id": "match_123",
      "driver": { ...driver summary... },
      "route": { ...route summary... },
      "pickupDistance": 0.5,  // km to pickup point
      "detourDistance": 0.2,  // extra distance for driver
      "matchScore": 95,
      "estimatedPickupTime": 5,  // minutes
      "pricePerSeat": 1500
    }
  ]
}

Note: ML-based matching considering:
- Proximity of pickup to driver's route
- Time alignment
- Historical preferences
- Driver rating
```

### 2. Find Riders (Driver)
```
POST /v1/match/find-riders

Request:
{
  "driverLat": 6.5244,
  "driverLng": 3.3792,
  "destLat": 6.4281,
  "destLng": 3.4219,
  "routeId": "route_123"
}

Response (200):
{
  "riders": [
    {
      "id": "match_456",
      "rider": { ...user summary... },
      "pickupPoint": { ... },
      "dropoffPoint": { ... },
      "seats": 1,
      "detourDistance": 0.3,
      "matchScore": 88
    }
  ]
}
```

---

## Notification Endpoints

### 1. Register Device for Push
```
POST /v1/notifications/register-device

Request:
{
  "token": "FCM_DEVICE_TOKEN",
  "platform": "android"  // or "ios"
}

Response (200):
{
  "success": true
}
```

### 2. Get Notifications
```
GET /v1/notifications?page=1&limit=20&unreadOnly=false

Response (200):
{
  "notifications": [
    {
      "id": "notif_123",
      "type": "booking_confirmed",
      "title": "Booking Confirmed",
      "body": "Your ride with John Driver is confirmed for 8:00 AM",
      "data": { "bookingId": "booking_123" },
      "isRead": false,
      "createdAt": "2024-12-08T07:05:00Z"
    }
  ],
  "unreadCount": 3
}
```

### 3. Mark Notification Read
```
PUT /v1/notifications/:id/read

Response (200):
{
  "success": true
}
```

### 4. Mark All Read
```
PUT /v1/notifications/read-all

Response (200):
{
  "success": true
}
```

---

## WebSocket Events

### Connection
```javascript
const socket = io(SOCKET_URL, {
  auth: { token: "JWT_TOKEN" }
});

socket.on('authenticated', () => {
  console.log('Connected and authenticated');
});
```

### Driver Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `driver:online` | Client → Server | `{}` |
| `driver:offline` | Client → Server | `{}` |
| `driver:location` | Client → Server | `{ lat, lng, heading, speed }` |
| `driver:destination:set` | Client → Server | `{ lat, lng, address }` |
| `driver:arrived:pickup` | Client → Server | `{ stopId }` |
| `booking:request` | Server → Client | `{ booking }` |
| `booking:cancelled` | Server → Client | `{ bookingId }` |

### Rider Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `rider:subscribe` | Client → Server | `{ driverId, tripId }` |
| `rider:unsubscribe` | Client → Server | `{ driverId }` |
| `driver:location:update` | Server → Client | `{ lat, lng, heading, eta }` |
| `driver:arrived` | Server → Client | `{ stopId }` |
| `trip:started` | Server → Client | `{ trip }` |
| `trip:completed` | Server → Client | `{ trip }` |
| `booking:confirmed` | Server → Client | `{ booking }` |
| `payment:success` | Server → Client | `{ payment, ticket }` |

---

## Data Models

### User
```typescript
{
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: 'rider' | 'driver';
  avatar?: string;
  rating: number;
  isVerified: boolean;
  createdAt: string;
}
```

### Driver
```typescript
{
  id: string;
  userId: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  vehicles: Vehicle[];
  activeVehicleId?: string;
}
```

### Vehicle
```typescript
{
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  type: 'sedan' | 'suv' | 'minivan' | 'bus';
  isActive: boolean;
}
```

### Route
```typescript
{
  id: string;
  driverId: string;
  origin: Location;
  destination: Location;
  stops: Stop[];
  departureTime: string;
  estimatedArrivalTime?: string;
  seatsAvailable: number;
  totalSeats: number;
  pricePerSeat: number;
  distance: number;  // km
  duration: number;  // minutes
  polyline?: string;  // encoded polyline
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isRecurring: boolean;
  recurringDays?: number[];
}
```

### Booking
```typescript
{
  id: string;
  routeId: string;
  riderId: string;
  driverId: string;
  seats: number;
  pickupPoint: Location;
  dropoffPoint: Location;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'ACCEPTED' | 'REJECTED' | 
          'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  totalPrice: number;
  paymentId?: string;
  ticketId?: string;
  expiresAt?: string;  // Seat hold expiration
  createdAt: string;
}
```

### Trip
```typescript
{
  id: string;
  routeId: string;
  driverId: string;
  status: 'SCHEDULED' | 'DRIVER_ENROUTE' | 'ARRIVED_PICKUP' | 
          'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startedAt?: string;
  completedAt?: string;
  actualRoute?: Coordinates[];
  distance?: number;
  duration?: number;
  bookings: Booking[];
  currentLocation?: Coordinates;
  eta?: number;
}
```

### Location
```typescript
{
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}
```

---

## Error Handling

All errors should follow this format:
```json
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {}  // Optional additional info
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - Invalid or missing token
- `FORBIDDEN` (403) - Not allowed to perform action
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input
- `SEAT_UNAVAILABLE` (400) - Seats no longer available
- `PAYMENT_FAILED` (400) - Payment processing failed
- `RATE_LIMITED` (429) - Too many requests

---

## Notes for Backend Developer

1. **Seat Holding**: Use Redis with TTL for 10-minute seat holds on booking creation
2. **Idempotency**: Support idempotency keys for payment and booking creation
3. **Real-time**: Use Socket.io for real-time location updates and notifications
4. **Push Notifications**: Integrate with FCM for Android and iOS push
5. **Payment Gateway**: Integrate with Interswitch hosted payment widget
6. **Routing**: Use OSRM or Google Directions API for polyline generation
7. **Ticket QR**: Use HMAC-SHA256 for ticket signatures, include public key for offline verification
8. **Geocoding**: Use Google Places API or Nominatim for location search
