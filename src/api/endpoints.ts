// src/api/endpoints.ts
// ========================================================
// OPENRIDE API ENDPOINTS - Complete Backend Integration
// ========================================================
// This file contains ALL endpoints the backend needs to implement
// for full frontend functionality
// ========================================================

// ===========================================
// API Configuration
// ===========================================
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

// External APIs (for frontend use)
export const OSRM_BASE_URL = 'https://router.project-osrm.org';
export const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// ===========================================
// API VERSION
// ===========================================
export const API_VERSION = 'v1';

// ===========================================
// AUTHENTICATION ENDPOINTS
// ===========================================
export const AUTH_ENDPOINTS = {
  /**
   * POST /v1/auth/send-otp
   * Request: { phone: string }
   * Response: { success: boolean, message: string, expiresIn: number }
   * Description: Send OTP to phone number for verification
   */
  SEND_OTP: `/${API_VERSION}/auth/send-otp`,

  /**
   * POST /v1/auth/verify-otp
   * Request: { phone: string, code: string }
   * Response: { token: string, refreshToken: string, user: User, isNewUser: boolean }
   * Description: Verify OTP and return JWT tokens
   */
  VERIFY_OTP: `/${API_VERSION}/auth/verify-otp`,

  /**
   * POST /v1/auth/register
   * Request: { phone: string, name: string, email?: string, role: 'rider' | 'driver' }
   * Response: { user: User, token: string }
   * Description: Complete user registration after OTP verification
   */
  REGISTER: `/${API_VERSION}/auth/register`,

  /**
   * POST /v1/auth/refresh
   * Request: { refreshToken: string }
   * Response: { token: string, refreshToken: string }
   * Description: Refresh expired access token
   */
  REFRESH_TOKEN: `/${API_VERSION}/auth/refresh`,

  /**
   * POST /v1/auth/logout
   * Request: {} (uses Bearer token)
   * Response: { success: boolean }
   * Description: Invalidate current session
   */
  LOGOUT: `/${API_VERSION}/auth/logout`,

  /**
   * GET /v1/auth/me
   * Request: {} (uses Bearer token)
   * Response: { user: User }
   * Description: Get current authenticated user
   */
  GET_CURRENT_USER: `/${API_VERSION}/auth/me`,

  /**
   * PUT /v1/auth/profile
   * Request: { name?: string, email?: string, avatar?: string }
   * Response: { user: User }
   * Description: Update user profile
   */
  UPDATE_PROFILE: `/${API_VERSION}/auth/profile`,
};

// ===========================================
// USER & PROFILE ENDPOINTS
// ===========================================
export const USER_ENDPOINTS = {
  /**
   * GET /v1/users/:id
   * Response: { user: User }
   * Description: Get user by ID (public profile)
   */
  GET_USER: `/${API_VERSION}/users/:id`,

  /**
   * PUT /v1/users/profile
   * Request: { name?: string, email?: string, avatar?: File }
   * Response: { user: User }
   * Description: Update current user profile
   */
  UPDATE_PROFILE: `/${API_VERSION}/users/profile`,

  /**
   * POST /v1/users/avatar
   * Request: FormData with avatar file
   * Response: { avatarUrl: string }
   * Description: Upload profile avatar
   */
  UPLOAD_AVATAR: `/${API_VERSION}/users/avatar`,

  /**
   * GET /v1/users/stats
   * Response: { totalTrips: number, totalDistance: number, totalSpent/Earned: number, rating: number }
   * Description: Get user statistics
   */
  GET_STATS: `/${API_VERSION}/users/stats`,
};

// ===========================================
// DRIVER KYC ENDPOINTS
// ===========================================
export const KYC_ENDPOINTS = {
  /**
   * POST /v1/kyc/submit
   * Request: FormData { 
   *   driversLicense: File, 
   *   vehicleRegistration: File,
   *   insurance: File,
   *   profilePhoto: File 
   * }
   * Response: { kycId: string, status: 'PENDING' }
   * Description: Submit KYC documents for driver verification
   */
  SUBMIT_KYC: `/${API_VERSION}/kyc/submit`,

  /**
   * GET /v1/kyc/status
   * Response: { status: 'PENDING' | 'APPROVED' | 'REJECTED', reason?: string }
   * Description: Get KYC verification status
   */
  GET_KYC_STATUS: `/${API_VERSION}/kyc/status`,

  /**
   * POST /v1/kyc/vehicle
   * Request: { make: string, model: string, year: number, color: string, licensePlate: string, seats: number }
   * Response: { vehicleId: string }
   * Description: Register driver's vehicle
   */
  REGISTER_VEHICLE: `/${API_VERSION}/kyc/vehicle`,
};

// ===========================================
// LOCATION & GEOCODING ENDPOINTS
// ===========================================
export const LOCATION_ENDPOINTS = {
  /**
   * GET /v1/locations/search?query=:query&lat=:lat&lng=:lng
   * Response: { results: LocationSuggestion[] }
   * Description: Search for locations by text query (geocoding)
   */
  SEARCH_LOCATIONS: `/${API_VERSION}/locations/search`,

  /**
   * GET /v1/locations/reverse?lat=:lat&lng=:lng
   * Response: { address: string, city: string, state: string, country: string }
   * Description: Reverse geocode coordinates to address
   */
  REVERSE_GEOCODE: `/${API_VERSION}/locations/reverse`,

  /**
   * GET /v1/locations/meeting-points?lat=:lat&lng=:lng&destLat=:destLat&destLng=:destLng
   * Response: { meetingPoints: MeetingPoint[] }
   * Description: Find smart meeting points near user along route to destination
   */
  GET_MEETING_POINTS: `/${API_VERSION}/locations/meeting-points`,

  /**
   * GET /v1/locations/popular
   * Response: { locations: PopularLocation[] }
   * Description: Get popular/frequently used locations in the area
   */
  GET_POPULAR_LOCATIONS: `/${API_VERSION}/locations/popular`,
};

// ===========================================
// ROUTE ENDPOINTS (Driver creates routes)
// ===========================================
export const ROUTE_ENDPOINTS = {
  /**
   * POST /v1/routes
   * Request: {
   *   origin: { lat: number, lng: number, address: string },
   *   destination: { lat: number, lng: number, address: string },
   *   stops: Stop[],
   *   departureTime: string (ISO),
   *   seatsAvailable: number,
   *   pricePerSeat: number,
   *   vehicleId: string,
   *   isRecurring: boolean,
   *   recurringDays?: number[] (0-6 for days)
   * }
   * Response: { route: Route }
   * Description: Driver creates a new route
   */
  CREATE_ROUTE: `/${API_VERSION}/routes`,

  /**
   * GET /v1/routes/search?lat=:lat&lng=:lng&destLat=:destLat&destLng=:destLng&date=:date
   * Response: { routes: RouteSummary[] }
   * Description: Search available routes from origin to destination
   */
  SEARCH_ROUTES: `/${API_VERSION}/routes/search`,

  /**
   * GET /v1/routes/nearby?lat=:lat&lng=:lng&radius=:radius
   * Response: { routes: RouteSummary[] }
   * Description: Get routes near a location
   */
  GET_NEARBY_ROUTES: `/${API_VERSION}/routes/nearby`,

  /**
   * GET /v1/routes/:id
   * Response: { route: Route }
   * Description: Get route details by ID
   */
  GET_ROUTE: `/${API_VERSION}/routes/:id`,

  /**
   * PUT /v1/routes/:id
   * Request: Partial<Route>
   * Response: { route: Route }
   * Description: Update route details
   */
  UPDATE_ROUTE: `/${API_VERSION}/routes/:id`,

  /**
   * DELETE /v1/routes/:id
   * Response: { success: boolean }
   * Description: Cancel/delete a route
   */
  DELETE_ROUTE: `/${API_VERSION}/routes/:id`,

  /**
   * GET /v1/routes/driver/active
   * Response: { routes: Route[] }
   * Description: Get driver's active routes
   */
  GET_DRIVER_ROUTES: `/${API_VERSION}/routes/driver/active`,

  /**
   * GET /v1/routes/driver/history
   * Response: { routes: Route[], pagination: Pagination }
   * Description: Get driver's route history
   */
  GET_DRIVER_ROUTE_HISTORY: `/${API_VERSION}/routes/driver/history`,
};

// ===========================================
// BOOKING ENDPOINTS
// ===========================================
export const BOOKING_ENDPOINTS = {
  /**
   * POST /v1/bookings
   * Request: {
   *   routeId: string,
   *   seats: number,
   *   pickupPoint: { lat: number, lng: number, address: string },
   *   dropoffPoint: { lat: number, lng: number, address: string },
   *   idempotencyKey: string
   * }
   * Response: { booking: Booking, paymentIntent: PaymentIntent }
   * Description: Create a booking (holds seats for 10 min)
   */
  CREATE_BOOKING: `/${API_VERSION}/bookings`,

  /**
   * GET /v1/bookings/:id
   * Response: { booking: Booking }
   * Description: Get booking details
   */
  GET_BOOKING: `/${API_VERSION}/bookings/:id`,

  /**
   * POST /v1/bookings/:id/cancel
   * Request: { reason?: string }
   * Response: { booking: Booking, refundAmount?: number }
   * Description: Cancel a booking
   */
  CANCEL_BOOKING: `/${API_VERSION}/bookings/:id/cancel`,

  /**
   * GET /v1/bookings/:id/ticket
   * Response: { ticket: Ticket }
   * Description: Get QR ticket for booking
   */
  GET_TICKET: `/${API_VERSION}/bookings/:id/ticket`,

  /**
   * POST /v1/bookings/:id/verify-ticket
   * Request: { qrData: string, signature: string }
   * Response: { valid: boolean, booking: Booking }
   * Description: Verify a ticket QR code (driver scans)
   */
  VERIFY_TICKET: `/${API_VERSION}/bookings/:id/verify-ticket`,

  /**
   * GET /v1/bookings/rider/active
   * Response: { bookings: Booking[] }
   * Description: Get rider's active bookings
   */
  GET_RIDER_BOOKINGS: `/${API_VERSION}/bookings/rider/active`,

  /**
   * GET /v1/bookings/rider/history
   * Response: { bookings: Booking[], pagination: Pagination }
   * Description: Get rider's booking history
   */
  GET_RIDER_HISTORY: `/${API_VERSION}/bookings/rider/history`,

  /**
   * GET /v1/bookings/driver/pending
   * Response: { bookings: Booking[] }
   * Description: Get pending booking requests for driver
   */
  GET_DRIVER_PENDING: `/${API_VERSION}/bookings/driver/pending`,

  /**
   * POST /v1/bookings/:id/accept
   * Response: { booking: Booking }
   * Description: Driver accepts a booking request
   */
  ACCEPT_BOOKING: `/${API_VERSION}/bookings/:id/accept`,

  /**
   * POST /v1/bookings/:id/reject
   * Request: { reason?: string }
   * Response: { success: boolean }
   * Description: Driver rejects a booking request
   */
  REJECT_BOOKING: `/${API_VERSION}/bookings/:id/reject`,

  /**
   * POST /v1/bookings/:id/checkin
   * Request: { qrData: string }
   * Response: { booking: Booking }
   * Description: Check in rider (scan QR at pickup)
   */
  CHECKIN_RIDER: `/${API_VERSION}/bookings/:id/checkin`,
};

// ===========================================
// PAYMENT ENDPOINTS
// ===========================================
export const PAYMENT_ENDPOINTS = {
  /**
   * POST /v1/payments/initiate
   * Request: { bookingId: string, amount: number, currency: string, idempotencyKey: string }
   * Response: { paymentId: string, widgetToken: string, paymentUrl: string }
   * Description: Initialize payment with Interswitch
   */
  INITIATE_PAYMENT: `/${API_VERSION}/payments/initiate`,

  /**
   * GET /v1/payments/:id/status
   * Response: { status: PaymentStatus, transaction: PaymentTransaction }
   * Description: Get payment status
   */
  GET_PAYMENT_STATUS: `/${API_VERSION}/payments/:id/status`,

  /**
   * POST /v1/payments/:id/verify
   * Request: { transactionRef: string }
   * Response: { verified: boolean, payment: Payment }
   * Description: Verify payment completion
   */
  VERIFY_PAYMENT: `/${API_VERSION}/payments/:id/verify`,

  /**
   * GET /v1/payments/history
   * Response: { payments: Payment[], pagination: Pagination }
   * Description: Get payment history
   */
  GET_PAYMENT_HISTORY: `/${API_VERSION}/payments/history`,

  /**
   * POST /v1/payments/:id/refund
   * Request: { reason: string }
   * Response: { refund: Refund }
   * Description: Request refund for a payment
   */
  REQUEST_REFUND: `/${API_VERSION}/payments/:id/refund`,
};

// ===========================================
// PAYOUTS ENDPOINTS
// ===========================================
export const PAYOUTS_ENDPOINTS = {
  /**
   * POST /v1/payouts/request
   * Request: { amount: number, currency: string }
   * Response: { payoutId: string, status: 'PENDING' }
   * Description: Request a payout
   */
  REQUEST_PAYOUT: `/${API_VERSION}/payouts/request`,

  /**
   * GET /v1/payouts/requests
   * Response: { payouts: PayoutRequest[] }
   * Description: Get payout history
   */
  GET_PAYOUTS: `/${API_VERSION}/payouts/requests`,

  /**
   * GET /v1/payouts/balance
   * Response: { available: number, pending: number, currency: string }
   * Description: Get driver's wallet balance
   */
  GET_BALANCE: `/${API_VERSION}/payouts/balance`,

  /**
   * GET /v1/payouts/earnings
   * Query: ?from=date&to=date
   * Response: { totalEarnings: number, breakdown: any }
   * Description: Get earnings report
   */
  GET_EARNINGS: `/${API_VERSION}/payouts/earnings`,

  /**
   * POST /v1/payouts/bank-accounts
   * Request: { bankName: string, accountNumber: string, accountName: string }
   * Response: { bankAccount: BankAccount }
   * Description: Add a bank account for payouts
   */
  ADD_BANK_ACCOUNT: `/${API_VERSION}/payouts/bank-accounts`,

  /**
   * GET /v1/payouts/bank-accounts
   * Response: { bankAccounts: BankAccount[] }
   * Description: Get saved bank accounts
   */
  GET_BANK_ACCOUNTS: `/${API_VERSION}/payouts/bank-accounts`,
};

// ===========================================
// TICKETING ENDPOINTS
// ===========================================
export const TICKETING_ENDPOINTS = {
  /**
   * POST /v1/tickets/verify
   * Request: { ticketData: string, signature: string }
   * Response: { valid: boolean, ticket: Ticket }
   * Description: Verify a ticket signature (offline capable)
   */
  VERIFY_TICKET: `/${API_VERSION}/tickets/verify`,

  /**
   * GET /v1/tickets/public-key
   * Response: { publicKey: string, keyId: string }
   * Description: Get public key for offline verification
   */
  GET_PUBLIC_KEY: `/${API_VERSION}/tickets/public-key`,
};

// ===========================================
// SEARCH ENDPOINTS
// ===========================================
export const SEARCH_ENDPOINTS = {
  /**
   * POST /v1/search
   * Request: { 
   *   origin: { lat, lng }, 
   *   destination: { lat, lng }, 
   *   date: string,
   *   preferences: { ... } 
   * }
   * Response: { routes: Route[] }
   * Description: Advanced route search
   */
  ADVANCED_SEARCH: `/${API_VERSION}/search`,
};

// ===========================================
// TRIP ENDPOINTS
// ===========================================
export const TRIP_ENDPOINTS = {
  /**
   * POST /v1/trips/start
   * Request: { routeId: string }
   * Response: { trip: Trip }
   * Description: Driver starts a trip
   */
  START_TRIP: `/${API_VERSION}/trips/start`,

  /**
   * GET /v1/trips/:id
   * Response: { trip: Trip }
   * Description: Get trip details
   */
  GET_TRIP: `/${API_VERSION}/trips/:id`,

  /**
   * GET /v1/trips/active
   * Response: { trip: Trip | null }
   * Description: Get current active trip
   */
  GET_ACTIVE_TRIP: `/${API_VERSION}/trips/active`,

  /**
   * POST /v1/trips/:id/location
   * Request: { lat: number, lng: number, heading: number, speed: number, timestamp: number }
   * Response: { success: boolean }
   * Description: Update driver location during trip
   */
  UPDATE_TRIP_LOCATION: `/${API_VERSION}/trips/:id/location`,

  /**
   * POST /v1/trips/:id/arrived-pickup
   * Request: { stopId: string }
   * Response: { trip: Trip }
   * Description: Driver arrived at pickup point
   */
  ARRIVED_PICKUP: `/${API_VERSION}/trips/:id/arrived-pickup`,

  /**
   * POST /v1/trips/:id/complete
   * Response: { trip: Trip, earnings: number }
   * Description: Complete the trip
   */
  COMPLETE_TRIP: `/${API_VERSION}/trips/:id/complete`,

  /**
   * POST /v1/trips/:id/cancel
   * Request: { reason: string }
   * Response: { trip: Trip }
   * Description: Cancel ongoing trip
   */
  CANCEL_TRIP: `/${API_VERSION}/trips/:id/cancel`,

  /**
   * POST /v1/trips/:id/rate
   * Request: { rating: number (1-5), comment?: string, badges?: string[] }
   * Response: { success: boolean }
   * Description: Rate a completed trip
   */
  RATE_TRIP: `/${API_VERSION}/trips/:id/rate`,

  /**
   * GET /v1/trips/history
   * Query: ?page=:page&limit=:limit&role=:role
   * Response: { trips: Trip[], pagination: Pagination }
   * Description: Get trip history
   */
  GET_TRIP_HISTORY: `/${API_VERSION}/trips/history`,

  /**
   * POST /v1/trips/:id/sos
   * Request: { location: { lat: number, lng: number }, message?: string }
   * Response: { sosId: string, emergencyContacted: boolean }
   * Description: Trigger SOS emergency
   */
  SOS: `/${API_VERSION}/trips/:id/sos`,
};

// ===========================================
// DRIVER-SPECIFIC ENDPOINTS
// ===========================================
export const DRIVER_ENDPOINTS = {
  /**
   * POST /v1/driver/status
   * Request: { isOnline: boolean }
   * Response: { status: 'online' | 'offline' }
   * Description: Set driver online/offline status
   */
  SET_STATUS: `/${API_VERSION}/driver/status`,

  /**
   * POST /v1/driver/location
   * Request: { lat: number, lng: number, heading: number, speed: number }
   * Response: { success: boolean }
   * Description: Update driver's current location
   */
  UPDATE_LOCATION: `/${API_VERSION}/driver/location`,

  /**
   * POST /v1/driver/destination
   * Request: { lat: number, lng: number, address: string }
   * Response: { destination: Destination, matchingRiders: number }
   * Description: Set driver's destination for matchmaking
   */
  SET_DESTINATION: `/${API_VERSION}/driver/destination`,

  /**
   * DELETE /v1/driver/destination
   * Response: { success: boolean }
   * Description: Clear driver's destination
   */
  CLEAR_DESTINATION: `/${API_VERSION}/driver/destination`,

  /**
   * GET /v1/driver/earnings
   * Query: ?period=daily|weekly|monthly
   * Response: { earnings: Earnings }
   * Description: Get driver earnings summary
   */
  GET_EARNINGS: `/${API_VERSION}/driver/earnings`,

  /**
   * GET /v1/driver/stats
   * Response: { stats: DriverStats }
   * Description: Get driver statistics
   */
  GET_STATS: `/${API_VERSION}/driver/stats`,

  /**
   * GET /v1/driver/vehicles
   * Response: { vehicles: Vehicle[] }
   * Description: Get driver's registered vehicles
   */
  GET_VEHICLES: `/${API_VERSION}/driver/vehicles`,

  /**
   * POST /v1/driver/vehicles
   * Request: Vehicle
   * Response: { vehicle: Vehicle }
   * Description: Add a new vehicle
   */
  ADD_VEHICLE: `/${API_VERSION}/driver/vehicles`,

  /**
   * PUT /v1/driver/vehicles/:id
   * Request: Partial<Vehicle>
   * Response: { vehicle: Vehicle }
   * Description: Update vehicle details
   */
  UPDATE_VEHICLE: `/${API_VERSION}/driver/vehicles/:id`,

  /**
   * DELETE /v1/driver/vehicles/:id
   * Response: { success: boolean }
   * Description: Remove a vehicle
   */
  DELETE_VEHICLE: `/${API_VERSION}/driver/vehicles/:id`,
};

// ===========================================
// MATCHMAKING ENDPOINTS
// ===========================================
export const MATCHMAKING_ENDPOINTS = {
  /**
   * POST /v1/match/find-drivers
   * Request: { 
   *   pickupLat: number, pickupLng: number,
   *   destLat: number, destLng: number,
   *   seats: number,
   *   departureTime?: string
   * }
   * Response: { drivers: MatchedDriver[] }
   * Description: Find available drivers for a ride
   */
  FIND_DRIVERS: `/${API_VERSION}/match/find-drivers`,

  /**
   * POST /v1/match/find-riders
   * Request: {
   *   driverLat: number, driverLng: number,
   *   destLat: number, destLng: number,
   *   routeId: string
   * }
   * Response: { riders: MatchedRider[] }
   * Description: Find riders along driver's route
   */
  FIND_RIDERS: `/${API_VERSION}/match/find-riders`,

  /**
   * GET /v1/match/suggestions
   * Response: { suggestions: RouteSuggestion[] }
   * Description: Get AI-powered route suggestions
   */
  GET_SUGGESTIONS: `/${API_VERSION}/match/suggestions`,
};

// ===========================================
// NOTIFICATION ENDPOINTS
// ===========================================
export const NOTIFICATION_ENDPOINTS = {
  /**
   * POST /v1/notifications/register-device
   * Request: { token: string, platform: 'ios' | 'android' }
   * Response: { success: boolean }
   * Description: Register device for push notifications
   */
  REGISTER_DEVICE: `/${API_VERSION}/notifications/register-device`,

  /**
   * GET /v1/notifications
   * Query: ?page=:page&limit=:limit&unreadOnly=:boolean
   * Response: { notifications: Notification[], unreadCount: number }
   * Description: Get user notifications
   */
  GET_NOTIFICATIONS: `/${API_VERSION}/notifications`,

  /**
   * PUT /v1/notifications/:id/read
   * Response: { success: boolean }
   * Description: Mark notification as read
   */
  MARK_READ: `/${API_VERSION}/notifications/:id/read`,

  /**
   * PUT /v1/notifications/read-all
   * Response: { success: boolean }
   * Description: Mark all notifications as read
   */
  MARK_ALL_READ: `/${API_VERSION}/notifications/read-all`,

  /**
   * PUT /v1/notifications/settings
   * Request: { pushEnabled: boolean, emailEnabled: boolean, smsEnabled: boolean }
   * Response: { settings: NotificationSettings }
   * Description: Update notification preferences
   */
  UPDATE_SETTINGS: `/${API_VERSION}/notifications/settings`,
};

// ===========================================
// WEBSOCKET EVENTS (Socket.io)
// ===========================================
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',

  // Driver Events (Emitted by driver)
  DRIVER_ONLINE: 'driver:online',
  DRIVER_OFFLINE: 'driver:offline',
  DRIVER_LOCATION: 'driver:location',
  DRIVER_DESTINATION_SET: 'driver:destination:set',
  DRIVER_DESTINATION_CLEAR: 'driver:destination:clear',
  DRIVER_ARRIVED_PICKUP: 'driver:arrived:pickup',
  DRIVER_TRIP_START: 'driver:trip:start',
  DRIVER_TRIP_END: 'driver:trip:end',

  // Driver Events (Received by driver)
  BOOKING_REQUEST: 'booking:request',
  BOOKING_CANCELLED: 'booking:cancelled',
  RIDER_LOCATION: 'rider:location',

  // Rider Events (Emitted by rider)
  RIDER_SUBSCRIBE: 'rider:subscribe',
  RIDER_UNSUBSCRIBE: 'rider:unsubscribe',
  RIDER_LOCATION_UPDATE: 'rider:location:update',

  // Rider Events (Received by rider)
  DRIVER_LOCATION_UPDATE: 'driver:location:update',
  DRIVER_ARRIVED: 'driver:arrived',
  TRIP_STARTED: 'trip:started',
  TRIP_COMPLETED: 'trip:completed',
  TRIP_CANCELLED: 'trip:cancelled',

  // Booking Events
  BOOKING_CONFIRMED: 'booking:confirmed',
  BOOKING_ACCEPTED: 'booking:accepted',
  BOOKING_REJECTED: 'booking:rejected',
  BOOKING_CHECKIN: 'booking:checkin',

  // Payment Events
  PAYMENT_SUCCESS: 'payment:success',
  PAYMENT_FAILED: 'payment:failed',

  // Chat Events
  CHAT_MESSAGE: 'chat:message',
  CHAT_TYPING: 'chat:typing',
};

// ===========================================
// COMBINED ENDPOINTS EXPORT
// ===========================================
export const ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  user: USER_ENDPOINTS,
  kyc: KYC_ENDPOINTS,
  location: LOCATION_ENDPOINTS,
  route: ROUTE_ENDPOINTS,
  booking: BOOKING_ENDPOINTS,
  payment: PAYMENT_ENDPOINTS,
  payouts: PAYOUTS_ENDPOINTS,
  ticketing: TICKETING_ENDPOINTS,
  search: SEARCH_ENDPOINTS,
  trip: TRIP_ENDPOINTS,
  driver: DRIVER_ENDPOINTS,
  match: MATCHMAKING_ENDPOINTS,
  notification: NOTIFICATION_ENDPOINTS,
  socket: SOCKET_EVENTS,
};

export default ENDPOINTS;
