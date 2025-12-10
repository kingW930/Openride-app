# OpenRide ML Data Collection Guide

This document explains where and how to collect data from the OpenRide frontend for training and improving the routing algorithm.

---

## Table of Contents

1. [Overview](#overview)
2. [Data Collection Points](#data-collection-points)
3. [WebSocket Events](#websocket-events)
4. [Data Schemas for ML Training](#data-schemas-for-ml-training)
5. [Backend Endpoints Needed](#backend-endpoints-needed)
6. [Frontend Integration Points](#frontend-integration-points)
7. [Recommended Data Pipeline](#recommended-data-pipeline)
8. [Next Steps](#next-steps)

---

## Overview

The OpenRide frontend collects and transmits various types of data that can be used for ML-powered route optimization:

- **Real-time GPS telemetry** from drivers
- **Trip performance metrics** (delays, duration, route adherence)
- **User behavior patterns** (search queries, meeting point selections, bookings)
- **Demand signals** (origin-destination pairs, time-of-day patterns)

The frontend is built with React Native + Expo and uses:
- **Zustand** for state management (stores hold trip/user data)
- **Socket.IO** for real-time location broadcasts
- **OSRM** for current routing (can be replaced/enhanced with ML model)

---

## Data Collection Points

### 1. Trip Telemetry Data

**Source File:** `src/store/tripStore.ts`

The trip store tracks real-time trip data including:

| Field | Type | Description |
|-------|------|-------------|
| `tripId` | string | Unique trip identifier |
| `driverId` | string | Driver's unique ID |
| `routeId` | string | Route being driven |
| `currentLocation` | `{lat, lng}` | Driver's current GPS position |
| `speed` | number | Current speed in km/h |
| `bearing` | number | Direction of travel (degrees) |
| `status` | enum | `scheduled`, `started`, `completed`, `cancelled` |
| `actualStartTime` | ISO string | When trip actually started |
| `actualEndTime` | ISO string | When trip ended |
| `passengers` | number | Current passenger count |

### 2. Driver Location Broadcasts

**Source File:** `src/services/socket.ts`

WebSocket connection emits continuous location data:

```typescript
// Driver sends location updates every 3-5 seconds
socket.emit('driver:location', {
  driverId: string,
  lat: number,
  lng: number,
  speed: number,
  bearing: number,
  timestamp: string  // ISO format
});
```

**ML Value:**
- Historical location trails for route analysis
- Speed profiles along road segments
- Traffic pattern detection (slow zones, congestion times)
- Rush hour identification

### 3. Route Performance Data

**Source Files:** `src/api/trips.ts`, `src/types/api.ts`

Trip completion data provides ground truth for model training:

```typescript
interface Trip {
  id: string;
  routeId: string;
  driverId: string;
  status: 'scheduled' | 'started' | 'completed' | 'cancelled';
  scheduledDepartureTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  stops: Stop[];
}

interface Stop {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  scheduledArrivalTime?: string;
  actualArrivalTime?: string;
  passengersBoarded: number;
  passengersAlighted: number;
}
```

**Collectible Metrics:**
- Actual vs scheduled arrival times (delay patterns)
- Stop dwell times (how long at each pickup)
- Route completion rates by time/day
- Cancellation patterns

### 4. Meeting Point Selection Patterns

**Source File:** `src/services/meetingPoints.ts`

Currently contains 145 Lagos meeting points with coordinates. User selection patterns are valuable:

```typescript
interface MeetingPointSelection {
  userId: string;
  selectedMeetingPointId: string;
  userOrigin: { lat: number; lng: number };
  routeDestination: { lat: number; lng: number };
  alternativesShown: string[];  // Other points offered
  selectionTime: string;
  distanceToPoint: number;      // meters
  wasUsed: boolean;             // Did booking complete?
}
```

**ML Value:**
- Which meeting points are most popular
- Walking distance tolerance by area
- Origin-destination clustering
- Optimal meeting point placement

### 5. Booking Patterns

**Source Files:** `src/api/rider.ts`, `src/types/api.ts`

Booking data reveals demand patterns:

```typescript
interface Booking {
  id: string;
  riderId: string;
  routeId: string;
  pickupStopId: string;
  dropoffStopId: string;
  bookingTime: string;      // When booking was made
  tripTime: string;         // Scheduled trip time
  numberOfSeats: number;
  fare: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
```

**ML Value:**
- Popular origin-destination pairs
- Demand by hour/day/location
- Seat utilization optimization
- Price elasticity (if fare varies)

### 6. Route Search Queries

**Source Files:** `app/rider/home.tsx`, `src/api/locations.ts`

User search behavior indicates latent demand:

```typescript
interface SearchEvent {
  userId: string;
  searchQuery: string;           // Raw text input
  geocodedLocation: { lat: number; lng: number };
  userCurrentLocation: { lat: number; lng: number };
  timestamp: string;
  resultsReturned: number;
  selectedResult?: string;
  ledToBooking: boolean;
}
```

**ML Value:**
- Underserved areas (searches with no routes)
- Demand hotspots
- Search-to-booking conversion rates
- Popular destinations

### 7. Driver Route Creation

**Source File:** `app/driver/home.tsx`

Drivers create routes with destinations:

```typescript
interface RouteCreation {
  driverId: string;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  plannedPolyline: string;       // Encoded polyline from OSRM
  plannedDuration: number;       // seconds
  plannedDistance: number;       // meters
  departureTime: string;
  seatsAvailable: number;
  pricePerSeat: number;
}
```

**ML Value:**
- Supply patterns (where drivers go)
- Route timing preferences
- Capacity distribution

---

## WebSocket Events

**Source File:** `src/services/socket.ts`

### Events to Log for ML:

| Event | Direction | Data | ML Use |
|-------|-----------|------|--------|
| `driver:online` | Client → Server | `{driverId, lat, lng}` | Driver availability patterns |
| `driver:location` | Client → Server | `{driverId, lat, lng, speed, bearing, timestamp}` | Trajectory data |
| `driver:offline` | Client → Server | `{driverId}` | Session duration |
| `rider:subscribe` | Client → Server | `{riderId, driverId}` | Tracking interest |
| `trip:started` | Server → Client | `{tripId, driverId, timestamp}` | Trip timing |
| `trip:completed` | Server → Client | `{tripId, duration, distance}` | Ground truth |
| `booking:confirmed` | Server → Client | `{bookingId, routeId}` | Demand confirmation |

---

## Data Schemas for ML Training

### Dataset 1: Trip Trajectories

For route optimization and ETA prediction:

```json
{
  "tripId": "trip_abc123",
  "routeId": "route_xyz789",
  "driverId": "driver_456",
  "date": "2025-12-10",
  "dayOfWeek": 2,
  "trajectoryPoints": [
    {
      "lat": 6.5244,
      "lng": 3.3792,
      "timestamp": "2025-12-10T08:00:00Z",
      "speed": 45,
      "bearing": 180
    },
    {
      "lat": 6.5240,
      "lng": 3.3790,
      "timestamp": "2025-12-10T08:00:05Z",
      "speed": 42,
      "bearing": 175
    }
  ],
  "plannedRoute": "encoded_polyline_string",
  "actualRoute": "encoded_polyline_string",
  "stops": [
    {
      "stopId": "stop_1",
      "name": "Ikeja Bus Stop",
      "lat": 6.5950,
      "lng": 3.3420,
      "scheduledArrival": "2025-12-10T08:15:00Z",
      "actualArrival": "2025-12-10T08:18:00Z",
      "delayMinutes": 3,
      "dwellTimeSeconds": 45,
      "passengersBoarded": 2
    }
  ],
  "totalPassengers": 4,
  "plannedDuration": 1800,
  "actualDuration": 2100,
  "delayMinutes": 5
}
```

### Dataset 2: Demand Patterns

For demand forecasting and route planning:

```json
{
  "timestamp": "2025-12-10T08:00:00Z",
  "hourOfDay": 8,
  "dayOfWeek": 2,
  "isHoliday": false,
  "origin": {
    "lat": 6.5244,
    "lng": 3.3792,
    "area": "Victoria Island"
  },
  "destination": {
    "lat": 6.6018,
    "lng": 3.3515,
    "area": "Ikeja"
  },
  "searchCount": 15,
  "bookingCount": 8,
  "conversionRate": 0.53,
  "averageFare": 1500,
  "averageWaitTime": 12
}
```

### Dataset 3: Route Performance

For model evaluation and ETA calibration:

```json
{
  "routeId": "route_xyz789",
  "origin": {"lat": 6.5244, "lng": 3.3792},
  "destination": {"lat": 6.6018, "lng": 3.3515},
  "distance": 12500,
  "scheduledDuration": 1800,
  "actualDuration": 2100,
  "delayMinutes": 5,
  "trafficConditions": "moderate",
  "weatherConditions": "clear",
  "dayOfWeek": 2,
  "hourOfDay": 8,
  "stopCount": 4,
  "passengerCount": 6,
  "dwellTimeTotal": 180
}
```

### Dataset 4: Meeting Point Usage

For optimizing pickup locations:

```json
{
  "meetingPointId": "mp_ikeja_001",
  "name": "Ikeja City Mall",
  "location": {"lat": 6.6018, "lng": 3.3515},
  "totalSelections": 245,
  "totalBookings": 198,
  "conversionRate": 0.81,
  "averageWalkingDistance": 320,
  "peakHours": [8, 9, 17, 18],
  "commonDestinations": [
    {"area": "Victoria Island", "count": 89},
    {"area": "Lekki", "count": 56}
  ]
}
```

---

## Backend Endpoints Needed

The ML engineer should work with the backend developer to create these analytics endpoints:

### Event Ingestion Endpoints

```typescript
// Add to src/api/endpoints.ts

ANALYTICS: {
  // Ingest real-time telemetry
  TRIP_TELEMETRY: '/v1/analytics/trip-telemetry',
  LOCATION_UPDATE: '/v1/analytics/location-update',
  
  // Ingest user behavior
  MEETING_POINT_SELECTION: '/v1/analytics/meeting-point-selection',
  ROUTE_SEARCH: '/v1/analytics/route-search',
  BOOKING_EVENT: '/v1/analytics/booking-event',
  
  // Data export for ML training
  EXPORT_TRAJECTORIES: '/v1/analytics/export/trajectories',
  EXPORT_DEMAND: '/v1/analytics/export/demand',
  EXPORT_PERFORMANCE: '/v1/analytics/export/performance',
  
  // Model integration
  PREDICT_ETA: '/v1/ml/predict-eta',
  OPTIMIZE_ROUTE: '/v1/ml/optimize-route',
  SUGGEST_MEETING_POINTS: '/v1/ml/suggest-meeting-points'
}
```

### Endpoint Specifications

#### POST /v1/analytics/trip-telemetry

```json
// Request
{
  "tripId": "string",
  "driverId": "string",
  "trajectoryPoints": [
    {"lat": 6.5244, "lng": 3.3792, "speed": 45, "bearing": 180, "timestamp": "ISO"}
  ]
}

// Response
{
  "success": true,
  "pointsIngested": 10
}
```

#### POST /v1/analytics/location-update

```json
// Request (high-frequency, use batch endpoint for efficiency)
{
  "driverId": "string",
  "locations": [
    {"lat": 6.5244, "lng": 3.3792, "speed": 45, "timestamp": "ISO"}
  ]
}

// Response
{
  "success": true
}
```

#### GET /v1/analytics/export/trajectories

```json
// Query params
?startDate=2025-12-01&endDate=2025-12-10&format=json|csv

// Response
{
  "count": 1500,
  "data": [...] // or CSV file download
}
```

---

## Frontend Integration Points

Where to add telemetry calls in the frontend:

### 1. Location Service (`src/services/location.ts`)

```typescript
// Add telemetry logging
export const logLocationUpdate = async (data: LocationUpdate) => {
  try {
    await api.post(ENDPOINTS.ANALYTICS.LOCATION_UPDATE, data);
  } catch (error) {
    // Queue for retry if offline
    await queueTelemetry('location', data);
  }
};
```

### 2. Socket Service (`src/services/socket.ts`)

```typescript
// Log all location broadcasts
socket.on('driver:location', (data) => {
  // Existing logic...
  
  // Add: Send to analytics
  logLocationUpdate({
    driverId: data.driverId,
    locations: [{ lat: data.lat, lng: data.lng, speed: data.speed, timestamp: data.timestamp }]
  });
});
```

### 3. Meeting Points Service (`src/services/meetingPoints.ts`)

```typescript
// Already prepared with this stub:
export const logMeetingPointSelection = async (data: MeetingPointSelectionEvent) => {
  await api.post(ENDPOINTS.ANALYTICS.MEETING_POINT_SELECTION, data);
};
```

### 4. Rider Home Screen (`app/rider/home.tsx`)

```typescript
// Log search events
const handleSearch = async (query: string) => {
  const results = await searchLocations(query, userLat, userLng);
  
  // Add: Log search event
  await api.post(ENDPOINTS.ANALYTICS.ROUTE_SEARCH, {
    userId: user.id,
    searchQuery: query,
    userLocation: { lat: userLat, lng: userLng },
    resultsCount: results.length,
    timestamp: new Date().toISOString()
  });
  
  return results;
};
```

---

## Recommended Data Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Native   │────▶│  Backend API    │────▶│  Data Lake      │
│  Frontend       │     │  (Node.js)      │     │  (S3/GCS)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  ML Training    │◀────│  Data Pipeline  │
                        │  (Python)       │     │  (Spark/Airflow)│
                        └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  Model Serving  │────▶│  Backend API    │
                        │  (TensorFlow)   │     │  /v1/ml/*       │
                        └─────────────────┘     └─────────────────┘
```

### Data Flow:

1. **Frontend** sends events via REST/WebSocket
2. **Backend** buffers and writes to data lake
3. **ETL Pipeline** transforms raw events into training datasets
4. **ML Training** uses datasets to build/update models
5. **Model Serving** exposes predictions via API
6. **Frontend** calls ML endpoints for ETA, route optimization

---

## Key Files Reference

| File | Purpose | ML Relevance |
|------|---------|--------------|
| `src/store/tripStore.ts` | Trip state management | Access current trip data |
| `src/services/socket.ts` | WebSocket connection | Real-time location events |
| `src/services/meetingPoints.ts` | Meeting point logic | 145 Lagos points + selection logging |
| `src/api/endpoints.ts` | API endpoint URLs | Add analytics endpoints here |
| `src/api/locations.ts` | Geocoding service | Search event data |
| `src/types/api.ts` | TypeScript interfaces | Data structure definitions |
| `app/rider/home.tsx` | Rider search UI | Search query logging |
| `app/driver/home.tsx` | Driver route creation | Route creation logging |

---

## Next Steps

### For ML Engineer:

1. **Define exact data requirements** - Which fields are essential vs nice-to-have
2. **Specify data volume expectations** - Events per second, retention period
3. **Choose storage format** - Parquet, JSON lines, etc.
4. **Design feature extraction** - What features will the model use

### For Backend Developer:

1. **Implement analytics endpoints** - See [Backend Endpoints Needed](#backend-endpoints-needed)
2. **Set up event streaming** - Kafka/Kinesis for high-volume telemetry
3. **Configure data lake** - S3/GCS with partitioning by date
4. **Add data export APIs** - For ML training dataset generation

### For Frontend Developer:

1. **Add telemetry calls** - See [Frontend Integration Points](#frontend-integration-points)
2. **Implement offline queuing** - Buffer events when offline
3. **Add ML endpoint calls** - When model serving is ready

---

## Questions?

Contact the team or refer to:
- `docs/API_DOCUMENTATION.md` - Full backend API spec
- `src/types/api.ts` - TypeScript type definitions
- `.github/copilot-instructions.md` - Project architecture overview
