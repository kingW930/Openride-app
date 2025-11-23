// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  SEND_OTP: '/v1/auth/send-otp',
  VERIFY_OTP: '/v1/auth/verify-otp',
  REGISTER: '/v1/auth/register',
  LOGOUT: '/v1/auth/logout',
  
  // Routes
  SEARCH_ROUTES: '/v1/routes',
  CREATE_ROUTE: '/v1/routes',
  
  // Bookings
  CREATE_BOOKING: '/v1/bookings',
  GET_BOOKING: '/v1/bookings/:id',
  CANCEL_BOOKING: '/v1/bookings/:id/cancel',
  GET_TICKET: '/v1/bookings/:id/ticket',
  
  // Driver
  DRIVER_LOCATION: '/v1/driver/location',
  DRIVER_STATUS: '/v1/driver/status',
  ACCEPT_BOOKING: '/v1/bookings/:id/accept',
  REJECT_BOOKING: '/v1/bookings/:id/reject',
  CHECKIN_RIDER: '/v1/bookings/:id/checkin',
  
  // Trips
  START_TRIP: '/v1/trips/:id/start',
  COMPLETE_TRIP: '/v1/trips/:id/complete',
  RATE_TRIP: '/v1/trips/:id/rate',
  GET_ACTIVE_TRIP: '/v1/trips/active',
  GET_TRIP_HISTORY: '/v1/trips/history',
  SOS: '/v1/trips/:id/sos',
  
  // Payments
  INITIATE_PAYMENT: '/v1/payments/initiate',
  PAYMENT_STATUS: '/v1/payments/:id/status',
};
