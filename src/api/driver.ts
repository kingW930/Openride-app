import axiosInstance from './axiosInstance';
import { DRIVER_ENDPOINTS, ROUTE_ENDPOINTS, BOOKING_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  Route, 
  RouteSummary,
  Booking, 
  CreateRouteRequest,
  DriverStats,
  Earnings,
  Vehicle,
  Pagination,
  PaginatedResponse
} from '../types/api';

// ===========================================
// Route Management
// ===========================================

/**
 * Create a new route
 */
export const createRoute = async (data: CreateRouteRequest): Promise<ApiResponse<{ route: Route }>> => {
  const response = await axiosInstance.post<ApiResponse<{ route: Route }>>(
    ROUTE_ENDPOINTS.CREATE_ROUTE,
    data
  );
  return response.data;
};

/**
 * Get driver's active routes
 */
export const getDriverRoutes = async (): Promise<ApiResponse<{ routes: Route[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ routes: Route[] }>>(
    ROUTE_ENDPOINTS.GET_DRIVER_ROUTES
  );
  return response.data;
};

/**
 * Get route history
 */
export const getRouteHistory = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<Route>>> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Route>>>(
    ROUTE_ENDPOINTS.GET_DRIVER_ROUTE_HISTORY,
    { params: { page, limit } }
  );
  return response.data;
};

/**
 * Delete/Cancel a route
 */
export const deleteRoute = async (routeId: string): Promise<ApiResponse<{ success: boolean }>> => {
  const url = ROUTE_ENDPOINTS.DELETE_ROUTE.replace(':id', routeId);
  const response = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(url);
  return response.data;
};

// ===========================================
// Driver Status & Location
// ===========================================

/**
 * Set online/offline status
 */
export const setOnlineStatus = async (isOnline: boolean): Promise<ApiResponse<{ status: string }>> => {
  const response = await axiosInstance.post<ApiResponse<{ status: string }>>(
    DRIVER_ENDPOINTS.SET_STATUS,
    { isOnline }
  );
  return response.data;
};

/**
 * Update driver location (when online but not in trip)
 */
export const updateDriverLocation = async (
  lat: number, 
  lng: number, 
  heading: number, 
  speed: number
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
    DRIVER_ENDPOINTS.UPDATE_LOCATION,
    { lat, lng, heading, speed }
  );
  return response.data;
};

/**
 * Set destination for matchmaking
 */
export const setDestination = async (
  lat: number, 
  lng: number, 
  address: string
): Promise<ApiResponse<{ destination: any; matchingRiders: number }>> => {
  const response = await axiosInstance.post<ApiResponse<{ destination: any; matchingRiders: number }>>(
    DRIVER_ENDPOINTS.SET_DESTINATION,
    { lat, lng, address }
  );
  return response.data;
};

/**
 * Clear destination
 */
export const clearDestination = async (): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(
    DRIVER_ENDPOINTS.CLEAR_DESTINATION
  );
  return response.data;
};

// ===========================================
// Bookings Management
// ===========================================

/**
 * Get pending booking requests
 */
export const getPendingBookings = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ bookings: Booking[] }>>(
    BOOKING_ENDPOINTS.GET_DRIVER_PENDING
  );
  return response.data;
};

/**
 * Accept a booking
 */
export const acceptBooking = async (bookingId: string): Promise<ApiResponse<{ booking: Booking }>> => {
  const url = BOOKING_ENDPOINTS.ACCEPT_BOOKING.replace(':id', bookingId);
  const response = await axiosInstance.post<ApiResponse<{ booking: Booking }>>(url);
  return response.data;
};

/**
 * Reject a booking
 */
export const rejectBooking = async (
  bookingId: string, 
  reason?: string
): Promise<ApiResponse<{ success: boolean }>> => {
  const url = BOOKING_ENDPOINTS.REJECT_BOOKING.replace(':id', bookingId);
  const response = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
    url, 
    { reason }
  );
  return response.data;
};

/**
 * Check in rider (scan QR)
 */
export const checkInRider = async (
  bookingId: string, 
  qrData: string
): Promise<ApiResponse<{ booking: Booking }>> => {
  const url = BOOKING_ENDPOINTS.CHECKIN_RIDER.replace(':id', bookingId);
  const response = await axiosInstance.post<ApiResponse<{ booking: Booking }>>(
    url, 
    { qrData }
  );
  return response.data;
};

/**
 * Get active bookings (accepted/in-progress)
 */
export const getActiveBookings = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ bookings: Booking[] }>>('/v1/driver/bookings/active');
  return response.data;
};

// ===========================================
// Stats & Vehicles
// ===========================================

/**
 * Get driver earnings
 */
export const getEarnings = async (
  period: 'daily' | 'weekly' | 'monthly' = 'weekly'
): Promise<ApiResponse<{ earnings: Earnings }>> => {
  const response = await axiosInstance.get<ApiResponse<{ earnings: Earnings }>>(
    DRIVER_ENDPOINTS.GET_EARNINGS,
    { params: { period } }
  );
  return response.data;
};

/**
 * Get driver stats
 */
export const getDriverStats = async (): Promise<ApiResponse<{ stats: DriverStats }>> => {
  const response = await axiosInstance.get<ApiResponse<{ stats: DriverStats }>>(
    DRIVER_ENDPOINTS.GET_STATS
  );
  return response.data;
};

/**
 * Get registered vehicles
 */
export const getVehicles = async (): Promise<ApiResponse<{ vehicles: Vehicle[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ vehicles: Vehicle[] }>>(
    DRIVER_ENDPOINTS.GET_VEHICLES
  );
  return response.data;
};

/**
 * Add a vehicle
 */
export const addVehicle = async (vehicle: Vehicle): Promise<ApiResponse<{ vehicle: Vehicle }>> => {
  const response = await axiosInstance.post<ApiResponse<{ vehicle: Vehicle }>>(
    DRIVER_ENDPOINTS.ADD_VEHICLE,
    vehicle
  );
  return response.data;
};

/**
 * Delete a vehicle
 */
export const deleteVehicle = async (vehicleId: string): Promise<ApiResponse<{ success: boolean }>> => {
  const url = DRIVER_ENDPOINTS.DELETE_VEHICLE.replace(':id', vehicleId);
  const response = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(url);
  return response.data;
};
