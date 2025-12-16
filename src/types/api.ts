// src/types/api.ts
// ========================================================
// OPENRIDE API TYPES - Complete Type Definitions
// ========================================================

export * from './user';
import { User } from './user';

// ===========================================
// Common Types
// ===========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address: string;
  name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// ===========================================
// Stop / Meeting Point
// ===========================================

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  arrivalTime?: string;
  address?: string;
}

export interface MeetingPoint {
  id: string;
  name: string;
  type: 'bus_stop' | 't_junction' | 'landmark' | 'intersection';
  latitude: number;
  longitude: number;
  address?: string;
  distanceFromUser?: number;
  distanceFromRoute?: number;
  walkingTime?: number;
  isOnRoute?: boolean;
}

// ===========================================
// Vehicle
// ===========================================

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  type: 'sedan' | 'suv' | 'minivan' | 'bus';
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// ===========================================
// Driver
// ===========================================

export interface DriverSummary {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  avatar?: string;
  vehicle: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
}

export interface Driver {
  id: string;
  userId: string;
  user: User;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
  isVerified: boolean;
  kycStatus: 'pending' | 'approved' | 'rejected';
  currentLocation?: Coordinates;
  currentDestination?: Location;
  vehicles: Vehicle[];
  activeVehicleId?: string;
  createdAt: string;
}

// ===========================================
// Route
// ===========================================

export type RouteStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface RouteSummary {
  id: string;
  driverId: string;
  driver: DriverSummary;
  origin: Location;
  destination: Location;
  stops: Stop[];
  departureTime: string;
  estimatedArrivalTime?: string;
  seatsAvailable: number;
  totalSeats: number;
  pricePerSeat: number;
  price: number; // Total price (legacy support)
  distance: number;
  duration: number;
  polyline?: string;
  status: RouteStatus;
}

export interface Route extends RouteSummary {
  createdAt: string;
  updatedAt: string;
  isRecurring: boolean;
  recurringDays?: number[];
  bookings?: Booking[];
}

export interface CreateRouteRequest {
  origin: Location;
  destination: Location;
  stops?: Omit<Stop, 'id'>[];
  departureTime: string;
  seatsAvailable: number;
  pricePerSeat: number;
  vehicleId: string;
  isRecurring?: boolean;
  recurringDays?: number[];
}

export interface SearchRoutesRequest {
  pickupLat: number;
  pickupLng: number;
  destLat: number;
  destLng: number;
  departureTime?: string;
  seats?: number;
}

// ===========================================
// Booking
// ===========================================

export type BookingStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Booking {
  id: string;
  routeId: string;
  riderId: string;
  driverId: string;
  seats: number;
  pickupPoint: Location;
  dropoffPoint: Location;
  pickupStopId?: string; // Legacy support
  dropoffStopId?: string; // Legacy support
  status: BookingStatus;
  price: number;
  totalPrice: number;
  paymentId?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  route?: RouteSummary;
  rider?: User;
  driver?: DriverSummary;
  trip?: Trip;
}

export interface CreateBookingRequest {
  routeId: string;
  seats: number;
  pickupPoint: Location;
  dropoffPoint: Location;
  idempotencyKey: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    expiresAt: string;
  };
}

// ===========================================
// Ticket
// ===========================================

export interface Ticket {
  id: string;
  bookingId: string;
  qrCode: string;
  qrCodeImage?: string;
  signature: string;
  publicKey?: string;
  expiresAt: string;
  issuedAt: string;
  isUsed: boolean;
  usedAt?: string;
}

export interface VerifyTicketRequest {
  qrData: string;
  signature: string;
}

export interface VerifyTicketResponse {
  valid: boolean;
  booking?: Booking;
  message?: string;
}

// ===========================================
// Payment
// ===========================================

export type PaymentStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'interswitch' | 'paystack' | 'flutterwave';
  transactionRef: string;
  providerRef?: string;
  widgetToken?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface InitiatePaymentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  idempotencyKey: string;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  widgetToken: string;
  paymentUrl: string;
  expiresAt: string;
}

export interface VerifyPaymentRequest {
  transactionRef: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  payment: Payment;
  ticket?: Ticket;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
}

// ===========================================
// Trip
// ===========================================

export type TripStatus = 
  | 'SCHEDULED'
  | 'DRIVER_ENROUTE'
  | 'ARRIVED_PICKUP'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {
  id: string;
  routeId: string;
  driverId: string;
  status: TripStatus;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  actualRoute?: Coordinates[];
  distance?: number;
  duration?: number;
  bookings: Booking[];
  driver: DriverSummary;
  currentLocation?: Coordinates;
  eta?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripLocationUpdate {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface RateRequest {
  rating: number;
  comment?: string;
  badges?: string[];
}

export interface SOSRequest {
  location: Coordinates;
  message?: string;
  contactEmergencyServices?: boolean;
}

export interface SOSResponse {
  sosId: string;
  emergencyContacted: boolean;
  supportTicketId?: string;
}

// ===========================================
// Driver Stats & Earnings
// ===========================================

export interface DriverStats {
  totalTrips: number;
  totalDistance: number;
  totalEarnings: number;
  rating: number;
  totalRatings: number;
  acceptanceRate: number;
  cancellationRate: number;
  onlineHours: number;
  memberSince: string;
}

export interface Earnings {
  period: 'daily' | 'weekly' | 'monthly';
  total: number;
  trips: number;
  tips: number;
  bonuses: number;
  deductions: number;
  netEarnings: number;
  breakdown: {
    date: string;
    amount: number;
    trips: number;
  }[];
}

// ===========================================
// Matchmaking
// ===========================================

export interface MatchedDriver {
  id: string;
  driver: DriverSummary;
  route: RouteSummary;
  pickupDistance: number;
  detourDistance: number;
  matchScore: number;
  estimatedPickupTime: number;
  pricePerSeat: number;
}

export interface MatchedRider {
  id: string;
  rider: User;
  pickupPoint: Location;
  dropoffPoint: Location;
  seats: number;
  detourDistance: number;
  matchScore: number;
}

export interface FindDriversRequest {
  pickupLat: number;
  pickupLng: number;
  destLat: number;
  destLng: number;
  seats: number;
  departureTime?: string;
}

export interface FindRidersRequest {
  driverLat: number;
  driverLng: number;
  destLat: number;
  destLng: number;
  routeId: string;
}

// ===========================================
// Notifications
// ===========================================

export type NotificationType = 
  | 'booking_request'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'trip_started'
  | 'driver_arrived'
  | 'trip_completed'
  | 'rating_received'
  | 'promotion'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  marketingEnabled: boolean;
  tripUpdates: boolean;
  paymentAlerts: boolean;
  promotions: boolean;
}

// ===========================================
// Auth
// ===========================================

export interface SendOTPRequest {
  phone: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn: number;
}

export interface VerifyOTPRequest {
  phone: string;
  code: string;
}

export interface VerifyOTPResponse {
  token: string;
  refreshToken: string;
  user: User;
  isNewUser: boolean;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  email?: string;
  role: 'rider' | 'driver';
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// ===========================================
// KYC
// ===========================================

export type KYCStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface KYCSubmission {
  driversLicense: File | string;
  vehicleRegistration: File | string;
  insurance: File | string;
  profilePhoto: File | string;
}

export interface KYCStatusResponse {
  status: KYCStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reason?: string;
  documents: {
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
  }[];
}

// ===========================================
// Payouts
// ===========================================

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PayoutRequest {
  id: string;
  driverId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  bankAccountId: string;
  requestedAt: string;
  processedAt?: string;
  reference?: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
  lastUpdated: string;
}

// ===========================================
// Ticket Verification
// ===========================================

export interface TicketVerificationResponse {
  valid: boolean;
  ticket?: Ticket;
  booking?: any; 
  error?: string;
}


