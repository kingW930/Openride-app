import { create } from 'zustand';
import { Trip, LocationUpdate } from '../types/trip';

interface TripState {
  activeTrip: Trip | null;
  driverLocation: LocationUpdate | null;
  setActiveTrip: (trip: Trip | null) => void;
  setDriverLocation: (location: LocationUpdate | null) => void;
  clearTrip: () => void;
}

export const useTripStore = create<TripState>((set) => ({
  activeTrip: null,
  driverLocation: null,

  setActiveTrip: (trip) => set({ activeTrip: trip }),
  
  setDriverLocation: (location) => set({ driverLocation: location }),
  
  clearTrip: () => set({ activeTrip: null, driverLocation: null }),
}));
