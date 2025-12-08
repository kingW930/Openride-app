import { create } from 'zustand';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface TripStats {
  totalTrips: number;
  todayTrips: number;
  totalEarnings: number;
  todayEarnings: number;
}

interface DriverState {
  online: boolean;
  isOnline: boolean;
  currentRequest: any;
  activeTrip: any;
  pendingRequests: any[];
  driverId: string | null;
  
  // Location tracking
  currentLocation: Location | null;
  setDestination: Location | null;
  isTracking: boolean;
  
  // Trip statistics
  tripStats: TripStats;
  completedTrips: any[];
  
  // Actions
  setOnline: (v: boolean) => void;
  setOnlineStatus: (v: boolean) => void;
  setIncomingRequest: (req: any) => void;
  acceptRequest: () => void;
  completeTrip: (fare?: number) => void;
  
  // Location actions
  setCurrentLocation: (loc: Location) => void;
  setDriverDestination: (dest: Location | null) => void;
  setIsTracking: (v: boolean) => void;
  
  // Stats actions
  updateTripStats: (stats: Partial<TripStats>) => void;
  addCompletedTrip: (trip: any) => void;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  online: false,
  isOnline: false,
  currentRequest: null,
  activeTrip: null,
  pendingRequests: [],
  driverId: null,
  
  // Location tracking
  currentLocation: null,
  setDestination: null,
  isTracking: false,
  
  // Trip statistics (mock initial data)
  tripStats: {
    totalTrips: 47,
    todayTrips: 5,
    totalEarnings: 156500,
    todayEarnings: 12800,
  },
  completedTrips: [],

  setOnline: (v: boolean) => set({ online: v, isOnline: v, isTracking: v }),
  setOnlineStatus: (v: boolean) => set({ online: v, isOnline: v, isTracking: v }),
  setIncomingRequest: (req: any) => set({ currentRequest: req }),
  acceptRequest: () => set((s) => ({ activeTrip: s.currentRequest, currentRequest: null })),
  
  completeTrip: (fare?: number) => {
    const currentTrip = get().activeTrip;
    const tripFare = fare || currentTrip?.fare || 1500;
    
    set((s) => ({
      activeTrip: null,
      completedTrips: [...s.completedTrips, { ...currentTrip, completedAt: new Date().toISOString(), fare: tripFare }],
      tripStats: {
        ...s.tripStats,
        totalTrips: s.tripStats.totalTrips + 1,
        todayTrips: s.tripStats.todayTrips + 1,
        totalEarnings: s.tripStats.totalEarnings + tripFare,
        todayEarnings: s.tripStats.todayEarnings + tripFare,
      },
    }));
  },
  
  // Location actions
  setCurrentLocation: (loc: Location) => set({ currentLocation: loc }),
  setDriverDestination: (dest: Location | null) => set({ setDestination: dest }),
  setIsTracking: (v: boolean) => set({ isTracking: v }),
  
  // Stats actions
  updateTripStats: (stats: Partial<TripStats>) => set((s) => ({ 
    tripStats: { ...s.tripStats, ...stats } 
  })),
  addCompletedTrip: (trip: any) => set((s) => ({ 
    completedTrips: [...s.completedTrips, trip] 
  })),
}));
