import axiosInstance from './axiosInstance';
import { Trip, TripStatus } from '../types/trip';

export const getActiveTrip = async (): Promise<Trip | null> => {
  const response = await axiosInstance.get('/v1/trips/active');
  return response.data;
};

export const getTripStatus = async (tripId: string): Promise<TripStatus> => {
  const response = await axiosInstance.get(`/v1/trips/${tripId}/status`);
  return response.data;
};

export const getTripHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<{ trips: Trip[]; total: number }> => {
  const response = await axiosInstance.get('/v1/trips/history', { params });
  return response.data;
};

export const getSOS = async (tripId: string): Promise<void> => {
  await axiosInstance.post(`/v1/trips/${tripId}/sos`);
};
