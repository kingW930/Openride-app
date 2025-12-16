import axiosInstance from './axiosInstance';
import { TRIP_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  Trip, 
  TripStatus, 
  PaginatedResponse,
  TripLocationUpdate,
  SOSResponse,
  Coordinates
} from '../types/api';

/**
 * Start a trip
 */
export const startTrip = async (routeId: string): Promise<ApiResponse<{ trip: Trip }>> => {
  const response = await axiosInstance.post<ApiResponse<{ trip: Trip }>>(
    TRIP_ENDPOINTS.START_TRIP,
    { routeId }
  );
  return response.data;
};

/**
 * Get trip details
 */
export const getTrip = async (tripId: string): Promise<ApiResponse<{ trip: Trip }>> => {
  const url = TRIP_ENDPOINTS.GET_TRIP.replace(':id', tripId);
  const response = await axiosInstance.get<ApiResponse<{ trip: Trip }>>(url);
  return response.data;
};

/**
 * Get active trip
 */
export const getActiveTrip = async (): Promise<ApiResponse<{ trip: Trip | null }>> => {
  const response = await axiosInstance.get<ApiResponse<{ trip: Trip | null }>>(
    TRIP_ENDPOINTS.GET_ACTIVE_TRIP
  );
  return response.data;
};

/**
 * Update trip location
 */
export const updateTripLocation = async (
  tripId: string,
  data: TripLocationUpdate
): Promise<ApiResponse<{ success: boolean }>> => {
  const url = TRIP_ENDPOINTS.UPDATE_TRIP_LOCATION.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
    url,
    data
  );
  return response.data;
};

/**
 * Arrived at pickup
 */
export const arrivedAtPickup = async (
  tripId: string,
  stopId: string
): Promise<ApiResponse<{ trip: Trip }>> => {
  const url = TRIP_ENDPOINTS.ARRIVED_PICKUP.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<{ trip: Trip }>>(
    url,
    { stopId }
  );
  return response.data;
};

/**
 * Complete trip
 */
export const completeTrip = async (
  tripId: string
): Promise<ApiResponse<{ trip: Trip; earnings: number }>> => {
  const url = TRIP_ENDPOINTS.COMPLETE_TRIP.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<{ trip: Trip; earnings: number }>>(
    url
  );
  return response.data;
};

/**
 * Cancel trip
 */
export const cancelTrip = async (
  tripId: string,
  reason: string
): Promise<ApiResponse<{ trip: Trip }>> => {
  const url = TRIP_ENDPOINTS.CANCEL_TRIP.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<{ trip: Trip }>>(
    url,
    { reason }
  );
  return response.data;
};

/**
 * Rate trip
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
 * Get trip history
 */
export const getTripHistory = async (
  page: number = 1,
  limit: number = 20,
  role: 'rider' | 'driver' = 'rider'
): Promise<ApiResponse<PaginatedResponse<Trip>>> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Trip>>>(
    TRIP_ENDPOINTS.GET_TRIP_HISTORY,
    { params: { page, limit, role } }
  );
  return response.data;
};

/**
 * Trigger SOS
 */
export const triggerSOS = async (
  tripId: string,
  location: Coordinates,
  message?: string
): Promise<ApiResponse<SOSResponse>> => {
  const url = TRIP_ENDPOINTS.SOS.replace(':id', tripId);
  const response = await axiosInstance.post<ApiResponse<SOSResponse>>(
    url,
    { location, message }
  );
  return response.data;
};
