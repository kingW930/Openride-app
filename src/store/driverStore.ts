import { create } from 'zustand';

interface DriverState {
  online: boolean;
  isOnline: boolean;
  currentRequest: any;
  activeTrip: any;
  pendingRequests: any[];
  driverId: string | null;
  setOnline: (v: boolean) => void;
  setOnlineStatus: (v: boolean) => void;
  setIncomingRequest: (req: any) => void;
  acceptRequest: () => void;
  completeTrip: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  online: false,
  isOnline: false,
  currentRequest: null,
  activeTrip: null,
  pendingRequests: [],
  driverId: null,

  setOnline: (v: boolean) => set({ online: v, isOnline: v }),
  setOnlineStatus: (v: boolean) => set({ online: v, isOnline: v }),
  setIncomingRequest: (req: any) => set({ currentRequest: req }),
  acceptRequest: () => set((s) => ({ activeTrip: s.currentRequest, currentRequest: null })),
  completeTrip: () => set({ activeTrip: null }),
}));
