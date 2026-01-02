import axiosInstance from './axiosInstance';
import type {
  VerificationStatusResponse,
  IdentityVerificationRequest,
  AffiliationVerificationRequest,
  CaptainVerificationRequest,
  VehicleRequest,
  Vehicle,
} from '../types/user';

/**
 * Verification API endpoints for identity, affiliation, and captain verification.
 */
export const verificationApi = {
  /**
   * Get current verification status for the authenticated user.
   */
  getStatus: async (): Promise<VerificationStatusResponse> => {
    const response = await axiosInstance.get<{ data: VerificationStatusResponse }>(
      '/v1/verification/status'
    );
    return response.data.data;
  },

  /**
   * Submit identity verification (NIN + Government ID + Selfie).
   */
  submitIdentity: async (
    request: IdentityVerificationRequest
  ): Promise<VerificationStatusResponse> => {
    const response = await axiosInstance.post<{ data: VerificationStatusResponse }>(
      '/v1/verification/identity',
      request
    );
    return response.data.data;
  },

  /**
   * Submit affiliation verification (Work/Student).
   */
  submitAffiliation: async (
    request: AffiliationVerificationRequest
  ): Promise<VerificationStatusResponse> => {
    const response = await axiosInstance.post<{ data: VerificationStatusResponse }>(
      '/v1/verification/affiliation',
      request
    );
    return response.data.data;
  },

  /**
   * Verify email for affiliation (token from email link).
   */
  verifyAffiliationEmail: async (token: string): Promise<VerificationStatusResponse> => {
    const response = await axiosInstance.get<{ data: VerificationStatusResponse }>(
      `/v1/verification/affiliation/verify-email?token=${encodeURIComponent(token)}`
    );
    return response.data.data;
  },

  /**
   * Submit captain verification (Driver's License).
   * Only for users who want to offer rides.
   */
  submitCaptain: async (
    request: CaptainVerificationRequest
  ): Promise<VerificationStatusResponse> => {
    const response = await axiosInstance.post<{ data: VerificationStatusResponse }>(
      '/v1/verification/captain',
      request
    );
    return response.data.data;
  },

  /**
   * Register a vehicle for the captain.
   */
  registerVehicle: async (request: VehicleRequest): Promise<Vehicle> => {
    const response = await axiosInstance.post<{ data: Vehicle }>(
      '/v1/verification/vehicles',
      request
    );
    return response.data.data;
  },

  /**
   * Get list of captain's vehicles.
   */
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await axiosInstance.get<{ data: Vehicle[] }>(
      '/v1/verification/vehicles'
    );
    return response.data.data;
  },

  /**
   * Activate a vehicle (set as current vehicle for trips).
   */
  activateVehicle: async (vehicleId: string): Promise<Vehicle> => {
    const response = await axiosInstance.put<{ data: Vehicle }>(
      `/v1/verification/vehicles/${vehicleId}/activate`
    );
    return response.data.data;
  },
};
