import { create } from 'zustand';
import { verificationApi } from '../api/verification';
import type {
  VerificationStatusResponse,
  IdentityVerificationRequest,
  AffiliationVerificationRequest,
  CaptainVerificationRequest,
  VehicleRequest,
  Vehicle,
  KYCStatus,
} from '../types/user';

interface VerificationState {
  // Status
  status: VerificationStatusResponse | null;
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStatus: () => Promise<void>;
  submitIdentity: (request: IdentityVerificationRequest) => Promise<void>;
  submitAffiliation: (request: AffiliationVerificationRequest) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  submitCaptain: (request: CaptainVerificationRequest) => Promise<void>;
  registerVehicle: (request: VehicleRequest) => Promise<void>;
  fetchVehicles: () => Promise<void>;
  activateVehicle: (vehicleId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useVerificationStore = create<VerificationState>((set, get) => ({
  status: null,
  vehicles: [],
  isLoading: false,
  error: null,

  fetchStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const status = await verificationApi.getStatus();
      set({ status, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch verification status';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  submitIdentity: async (request: IdentityVerificationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const status = await verificationApi.submitIdentity(request);
      set({ status, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Identity verification failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  submitAffiliation: async (request: AffiliationVerificationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const status = await verificationApi.submitAffiliation(request);
      set({ status, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Affiliation verification failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      const status = await verificationApi.verifyAffiliationEmail(token);
      set({ status, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email verification failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  submitCaptain: async (request: CaptainVerificationRequest) => {
    set({ isLoading: true, error: null });
    try {
      const status = await verificationApi.submitCaptain(request);
      set({ status, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Captain verification failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  registerVehicle: async (request: VehicleRequest) => {
    set({ isLoading: true, error: null });
    try {
      const vehicle = await verificationApi.registerVehicle(request);
      set((state) => ({
        vehicles: [...state.vehicles, vehicle],
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Vehicle registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  fetchVehicles: async () => {
    set({ isLoading: true, error: null });
    try {
      const vehicles = await verificationApi.getVehicles();
      set({ vehicles, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch vehicles';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  activateVehicle: async (vehicleId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedVehicle = await verificationApi.activateVehicle(vehicleId);
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === vehicleId ? { ...v, isActive: true } : { ...v, isActive: false }
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to activate vehicle';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      status: null,
      vehicles: [],
      isLoading: false,
      error: null,
    }),
}));

// Selector hooks for convenience
export const useVerificationStatus = () => useVerificationStore((s) => s.status);
export const useVerificationLoading = () => useVerificationStore((s) => s.isLoading);
export const useVerificationError = () => useVerificationStore((s) => s.error);
export const useVehicles = () => useVerificationStore((s) => s.vehicles);

// Convenience selectors for verification checks
export const useCanBookRides = () =>
  useVerificationStore((s) => s.status?.canBookRides ?? false);
export const useCanOfferRides = () =>
  useVerificationStore((s) => s.status?.canOfferRides ?? false);
export const useNextVerificationStep = () =>
  useVerificationStore((s) => s.status?.nextStep ?? 'identity');
