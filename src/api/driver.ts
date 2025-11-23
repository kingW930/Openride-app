import axiosInstance from './axiosInstance';
import { Route, Booking } from '../types/api';
import { LocationUpdate } from '../types/trip';

export const createRoute = async (data: {
  stops: Array<{ lat: number; lng: number; name: string; order: number }>;
  departureTime: string;
  seatsAvailable: number;
  price: number;
  vehicleId: string;
}): Promise<Route> => {
  const response = await axiosInstance.post('/v1/routes', data);
  return response.data;
};

export const updateDriverLocation = async (location: LocationUpdate): Promise<void> => {
  await axiosInstance.post('/v1/driver/location', location);
};

export const setOnlineStatus = async (isOnline: boolean): Promise<void> => {
  await axiosInstance.post('/v1/driver/status', { isOnline });
};

export const acceptBooking = async (bookingId: string): Promise<Booking> => {
  const response = await axiosInstance.post(`/v1/bookings/${bookingId}/accept`);
  return response.data;
};

export const rejectBooking = async (bookingId: string, reason?: string): Promise<void> => {
  await axiosInstance.post(`/v1/bookings/${bookingId}/reject`, { reason });
};

export const checkInRider = async (bookingId: string, qrData: string): Promise<void> => {
  await axiosInstance.post(`/v1/bookings/${bookingId}/checkin`, { qrData });
};

export const startTrip = async (routeId: string): Promise<void> => {
  await axiosInstance.post(`/v1/trips/${routeId}/start`);
};

export const completeTrip = async (routeId: string): Promise<void> => {
  await axiosInstance.post(`/v1/trips/${routeId}/complete`);
};

export const getActiveBookings = async (): Promise<Booking[]> => {
  const response = await axiosInstance.get('/v1/driver/bookings/active');
  return response.data;
};
