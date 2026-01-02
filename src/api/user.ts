import axiosInstance from './axiosInstance';
import { USER_ENDPOINTS, KYC_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  User, 
  KYCStatusResponse, 
  KYCSubmission 
} from '../types/api';

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>('/v1/users/me');
  return response.data.data;
};

/**
 * Get public user profile
 * @param userId - The user ID
 */
export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(`/v1/users/${userId}`);
  return response.data.data;
};

/**
 * Update user profile
 * @param data - Profile data to update
 */
export const updateProfile = async (
  data: { fullName?: string; email?: string }
): Promise<User> => {
  const response = await axiosInstance.patch<ApiResponse<User>>(
    '/v1/users/me',
    data
  );
  return response.data.data;
};

/**
 * Upgrade to captain role
 */
export const upgradeToCaptain = async (): Promise<User> => {
  const response = await axiosInstance.post<ApiResponse<User>>('/v1/users/upgrade-to-captain');
  return response.data.data;
};

/**
 * Upload profile avatar
 * @param imageUri - Local URI of the image
 */
export const uploadAvatar = async (imageUri: string): Promise<ApiResponse<{ avatarUrl: string }>> => {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() || 'avatar.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  // @ts-ignore - React Native FormData expects name, type, uri
  formData.append('avatar', { uri: imageUri, name: filename, type });

  const response = await axiosInstance.post<ApiResponse<{ avatarUrl: string }>>(
    USER_ENDPOINTS.UPLOAD_AVATAR,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<ApiResponse<any>> => {
  const response = await axiosInstance.get<ApiResponse<any>>(USER_ENDPOINTS.GET_STATS);
  return response.data;
};

// ===========================================
// KYC Functions
// ===========================================

/**
 * Submit KYC documents for captain verification
 * @param documents - KYC document URLs/data
 */
export const submitKYCDocuments = async (
  documents: {
    licensePhotoUrl: string;
    vehiclePhotoUrl: string;
    kycNotes?: string;
  }
): Promise<User> => {
  const response = await axiosInstance.post<ApiResponse<User>>(
    '/v1/captains/kyc-documents',
    documents
  );
  return response.data.data;
};

/**
 * Get KYC status (from user profile)
 */
export const getKYCStatus = async (): Promise<{ status: string; reason?: string }> => {
  const user = await getCurrentUser();
  return {
    status: user.kycStatus,
    reason: user.captainProfile?.kycNotes
  };
};

/**
 * Register vehicle (part of KYC)
 * @param vehicleData - Vehicle details
 */
export const registerVehicle = async (
  vehicleData: { 
    make: string; 
    model: string; 
    year: number; 
    color: string; 
    licensePlate: string; 
    seats: number 
  }
): Promise<ApiResponse<{ vehicleId: string }>> => {
  const response = await axiosInstance.post<ApiResponse<{ vehicleId: string }>>(
    KYC_ENDPOINTS.REGISTER_VEHICLE,
    vehicleData
  );
  return response.data;
};
