// src/types/driver-api.ts
// ========================================================
// DRIVER SERVICE TYPES (Python Backend - snake_case)
// ========================================================
// These types match the Python driver-service API which uses snake_case

/**
 * Stop data for route creation (Python backend format)
 */
export interface RouteStopCreate {
  stop_id?: string; // Use existing stop
  name?: string; // Create new stop
  lat?: number;
  lon?: number;
  address?: string;
  landmark?: string;
  planned_arrival_offset_minutes: number;
  price_from_origin: number;
}

/**
 * Route creation request (Python backend format)
 */
export interface RouteCreateRequest {
  vehicle_id: string;
  name: string;
  departure_time: string; // HH:MM:SS format
  active_days: number[]; // 0-6 (0=Monday)
  seats_total: number;
  base_price: number;
  schedule_rrule?: string;
  notes?: string;
  stops: RouteStopCreate[];
}

/**
 * Route response from Python backend (snake_case)
 */
export interface RouteResponsePython {
  id: string;
  driver_id: string;
  vehicle_id: string;
  name: string;
  departure_time: string;
  active_days: number[];
  seats_total: number;
  seats_available: number;
  base_price: number;
  schedule_rrule?: string;
  notes?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  stops?: RouteStopResponse[];
  created_at: string;
  updated_at: string;
}

/**
 * Route stop response (Python backend)
 */
export interface RouteStopResponse {
  id: string;
  stop_id: string;
  stop_order: number;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  planned_arrival_offset_minutes: number;
  price_from_origin: number;
}

/**
 * Route update request (Python backend format)
 */
export interface RouteUpdateRequest {
  name?: string;
  departure_time?: string;
  active_days?: number[];
  seats_total?: number;
  base_price?: number;
  schedule_rrule?: string;
  notes?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

/**
 * Helper function to convert camelCase route to snake_case for Python backend
 */
export function convertRouteToSnakeCase(route: any): RouteCreateRequest {
  return {
    vehicle_id: route.vehicleId,
    name: route.name,
    departure_time: route.departureTime,
    active_days: route.activeDays || route.recurringDays || [],
    seats_total: route.seatsAvailable || route.totalSeats,
    base_price: route.pricePerSeat,
    schedule_rrule: route.scheduleRrule,
    notes: route.notes,
    stops: (route.stops || []).map((stop: any) => ({
      stop_id: stop.stopId || stop.id,
      name: stop.name,
      lat: stop.lat || stop.latitude,
      lon: stop.lng || stop.lon || stop.longitude,
      address: stop.address,
      landmark: stop.landmark,
      planned_arrival_offset_minutes: stop.plannedArrivalOffsetMinutes || stop.order * 10,
      price_from_origin: stop.priceFromOrigin || 0,
    })),
  };
}

/**
 * Helper function to convert snake_case route response to camelCase for frontend
 */
export function convertRouteToCamelCase(route: RouteResponsePython): any {
  return {
    id: route.id,
    driverId: route.driver_id,
    vehicleId: route.vehicle_id,
    name: route.name,
    departureTime: route.departure_time,
    activeDays: route.active_days,
    recurringDays: route.active_days,
    totalSeats: route.seats_total,
    seatsAvailable: route.seats_available,
    pricePerSeat: route.base_price,
    scheduleRrule: route.schedule_rrule,
    notes: route.notes,
    status: route.status,
    stops: (route.stops || []).map((stop) => ({
      id: stop.id,
      stopId: stop.stop_id,
      name: stop.stop_name,
      lat: stop.stop_lat,
      lng: stop.stop_lon,
      latitude: stop.stop_lat,
      longitude: stop.stop_lon,
      order: stop.stop_order,
      plannedArrivalOffsetMinutes: stop.planned_arrival_offset_minutes,
      priceFromOrigin: stop.price_from_origin,
    })),
    createdAt: route.created_at,
    updatedAt: route.updated_at,
  };
}
