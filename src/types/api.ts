import { User } from './user';

export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
  arrivalTime?: string;
}

export interface RouteSummary {
  id: string;
  driverId: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    avatar?: string;
    vehicle: {
      make: string;
      model: string;
      color: string;
      licensePlate: string;
    };
  };
  stops: Stop[];
  departureTime: string;
  arrivalTime?: string;
  seatsAvailable: number;
  totalSeats: number;
  price: number;
  distance: number;
  duration: number;
  polyline?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface Route extends RouteSummary {
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PAID' 
  | 'CHECKED_IN' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface Booking {
  id: string;
  routeId: string;
  riderId: string;
  driverId: string;
  seats: number;
  pickupStopId: string;
  dropoffStopId: string;
  status: BookingStatus;
  price: number;
  paymentId?: string;
  ticketId?: string;
  createdAt: string;
  updatedAt: string;
  route?: RouteSummary;
  rider?: User;
}

export interface Ticket {
  id: string;
  bookingId: string;
  qrCode: string;
  signature: string;
  expiresAt: string;
  issuedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  provider: string;
  transactionRef: string;
  widgetToken?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}
