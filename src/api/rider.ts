import axiosInstance from './axiosInstance';
import { 
  ROUTE_ENDPOINTS, 
  BOOKING_ENDPOINTS, 
  SEARCH_ENDPOINTS, 
  TRIP_ENDPOINTS 
} from './endpoints';
import { 
  ApiResponse, 
  RouteSummary, 
  Booking, 
  Ticket, 
  PaginatedResponse,
  Coordinates
} from '../types/api';

/**
 * Search for routes (Simple)
 */
export const searchRoutes = async (params: {
  lat: number;
  lng: number;
  destLat?: number;
  destLng?: number;
  date?: string;
}): Promise<ApiResponse<{ routes: RouteSummary[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ routes: RouteSummary[] }>>(
    ROUTE_ENDPOINTS.SEARCH_ROUTES, 
    { params }
  );
  return response.data;
};

/**
 * Advanced Search
 */
export const advancedSearch = async (data: {
  origin: Coordinates;
  destination: Coordinates;
  date: string;
  preferences?: {
    maxPrice?: number;
    minRating?: number;
    vehicleType?: string[];
  };
}): Promise<ApiResponse<{ routes: RouteSummary[] }>> => {
  const response = await axiosInstance.post<ApiResponse<{ routes: RouteSummary[] }>>(
    SEARCH_ENDPOINTS.ADVANCED_SEARCH,
    data
  );
  return response.data;
};

/**
 * Create a booking
 */
export const createBooking = async (data: {
  routeId: string;
  originStopId: string;
  destinationStopId: string;
  travelDate: string;
  seatsBooked: number;
  idempotencyKey?: string;
  searchId?: string;
  candidateRank?: number;
  candidateCount?: number;
}): Promise<ApiResponse<{ booking: Booking; paymentIntent: any }>> => {
  const response = await axiosInstance.post<ApiResponse<{ booking: Booking; paymentIntent: any }>>(
    BOOKING_ENDPOINTS.CREATE_BOOKING, 
    data
  );
  return response.data;
};

/**
 * Get booking details
 */
export const getBookingDetails = async (bookingId: string): Promise<ApiResponse<{ booking: Booking }>> => {
  const url = BOOKING_ENDPOINTS.GET_BOOKING.replace(':id', bookingId);
  const response = await axiosInstance.get<ApiResponse<{ booking: Booking }>>(url);
  return response.data;
};

/**
 * Get ticket for booking
 */
export const getTicket = async (bookingId: string): Promise<ApiResponse<{ ticket: Ticket }>> => {
  const url = BOOKING_ENDPOINTS.GET_TICKET.replace(':id', bookingId);
  const response = await axiosInstance.get<ApiResponse<{ ticket: Ticket }>>(url);
  return response.data;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (
  bookingId: string, 
  reason?: string
): Promise<ApiResponse<{ booking: Booking; refundAmount?: number }>> => {
  const url = BOOKING_ENDPOINTS.CANCEL_BOOKING.replace(':id', bookingId);
  const response = await axiosInstance.post<ApiResponse<{ booking: Booking; refundAmount?: number }>>(
    url, 
    { reason }
  );
  return response.data;
};

/**
 * Rate a trip
 */
export const rateTrip = async (
  tripId: string, 
  rating: number, 
  comment?: string,
  badges?: string[]
): Promise<ApiResponse<{ success: boolean }>> => {
  const url = TRIP_ENDPOINTS.RATE_TRIP.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
    url, 
    { rating, comment, badges }
  );
  return response.data;
};

/**
 * Get active bookings
 */
export const getActiveBookings = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ bookings: Booking[] }>>(
    BOOKING_ENDPOINTS.GET_RIDER_BOOKINGS
  );
  return response.data;
};

/**
 * Get booking history
 */
export const getBookingHistory = async (
  page: number = 1, 
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Booking>>>(
    BOOKING_ENDPOINTS.GET_RIDER_HISTORY,
    { params: { page, limit } }
  );
  return response.data;
};
