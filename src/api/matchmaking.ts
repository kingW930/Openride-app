import { pythonAxiosInstance } from './axiosInstance';
import { MATCHMAKING_ENDPOINTS } from './endpoints';
import { ApiResponse } from '../types/api';

/**
 * Find available drivers for a ride (Python matchmaking service)
 */
export const findDrivers = async (data: {
  pickupLat: number;
  pickupLng: number;
  destLat: number;
  destLng: number;
  seats: number;
  departureTime?: string;
}): Promise<ApiResponse<{ drivers: any[] }>> => {
  const response = await pythonAxiosInstance.post<ApiResponse<{ drivers: any[] }>>(
    MATCHMAKING_ENDPOINTS.FIND_DRIVERS,
    data
  );
  return response.data;
};

/**
 * Find riders along driver's route (Python matchmaking service)
 */
export const findRiders = async (data: {
  driverLat: number;
  driverLng: number;
  destLat: number;
  destLng: number;
  routeId: string;
}): Promise<ApiResponse<{ riders: any[] }>> => {
  const response = await pythonAxiosInstance.post<ApiResponse<{ riders: any[] }>>(
    MATCHMAKING_ENDPOINTS.FIND_RIDERS,
    data
  );
  return response.data;
};

/**
 * Get AI-powered route suggestions (Python matchmaking service)
 */
export const getRouteSuggestions = async (): Promise<ApiResponse<{ suggestions: any[] }>> => {
  const response = await pythonAxiosInstance.get<ApiResponse<{ suggestions: any[] }>>(
    MATCHMAKING_ENDPOINTS.GET_SUGGESTIONS
  );
  return response.data;
};
