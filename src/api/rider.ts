import axiosInstance from './axiosInstance';
import { RouteSummary, Booking, Ticket } from '../types/api';

export const searchRoutes = async (params: {
  lat: number;
  lng: number;
  destination?: string;
  departureTime?: string;
}): Promise<RouteSummary[]> => {
  const response = await axiosInstance.get('/v1/routes', { params });
  return response.data;
};

export const createBooking = async (data: {
  routeId: string;
  seats: number;
  pickupStopId: string;
  dropoffStopId: string;
}): Promise<Booking> => {
  const response = await axiosInstance.post('/v1/bookings', data);
  return response.data;
};

export const getBookingDetails = async (bookingId: string): Promise<Booking> => {
  const response = await axiosInstance.get(`/v1/bookings/${bookingId}`);
  return response.data;
};

export const getTicket = async (bookingId: string): Promise<Ticket> => {
  const response = await axiosInstance.get(`/v1/bookings/${bookingId}/ticket`);
  return response.data;
};

export const cancelBooking = async (bookingId: string): Promise<void> => {
  await axiosInstance.post(`/v1/bookings/${bookingId}/cancel`);
};

export const rateTrip = async (tripId: string, rating: number, comment?: string): Promise<void> => {
  await axiosInstance.post(`/v1/trips/${tripId}/rate`, { rating, comment });
};
