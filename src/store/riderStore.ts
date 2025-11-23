import { create } from 'zustand';
import { RouteSummary, Booking } from '../types/api';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Trip {
  id: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  pickup: string;
  destination: string;
  fare: number;
  date: string;
  driver?: {
    name: string;
    rating: number;
  };
}

interface RiderState {
  searchResults: RouteSummary[];
  currentBooking: Booking | null;
  pickup: Location | null;
  destination: Location | null;
  tripHistory: Trip[];
  setSearchResults: (routes: RouteSummary[]) => void;
  setCurrentBooking: (booking: Booking | null) => void;
  setPickup: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;
  clearSearch: () => void;
}

export const useRiderStore = create<RiderState>((set) => ({
  searchResults: [],
  currentBooking: null,
  pickup: null,
  destination: null,
  tripHistory: [],

  setSearchResults: (routes) => set({ searchResults: routes }),
  
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  
  setPickup: (location) => set({ pickup: location }),
  
  setDestination: (location) => set({ destination: location }),
  
  clearSearch: () => set({ searchResults: [] }),
}));
