export type TripStatus = 
  | 'PENDING'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_ARRIVING'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface LocationUpdate {
  lat: number;
  lon: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface Trip {
  id: string;
  routeId: string;
  bookingId: string;
  status: TripStatus;
  startTime?: string;
  endTime?: string;
  distance?: number;
  duration?: number;
  currentLocation?: LocationUpdate;
  eta?: number;
  createdAt: string;
  updatedAt: string;
}
