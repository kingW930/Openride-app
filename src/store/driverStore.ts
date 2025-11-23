import { create } from 'zustand';
import { Booking } from '../types/api';

interface DriverState {
  isOnline: boolean;
  pendingRequests: Booking[];
  activeBookings: Booking[];
  setOnlineStatus: (status: boolean) => void;
  addPendingRequest: (request: Booking) => void;
  removePendingRequest: (requestId: string) => void;
  setActiveBookings: (bookings: Booking[]) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  isOnline: false,
  pendingRequests: [],
  activeBookings: [],

  setOnlineStatus: (status) => set({ isOnline: status }),
  
  addPendingRequest: (request) =>
    set((state) => ({
      pendingRequests: [...state.pendingRequests, request],
    })),
  
  removePendingRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
    })),
  
  setActiveBookings: (bookings) => set({ activeBookings: bookings }),
}));
