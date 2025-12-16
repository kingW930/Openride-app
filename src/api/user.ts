import axiosInstance from './axiosInstance';
import { USER_ENDPOINTS, KYC_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  User, 
  KYCStatusResponse, 
  KYCSubmission 
} from '../types/api';

/**
 * Get public user profile
 * @param userId - The user ID
 */
export const getUserProfile = async (userId: string): Promise<ApiResponse<{ user: User }>> => {
  const url = USER_ENDPOINTS.GET_USER.replace(':id', userId);
  const response = await axiosInstance.get<ApiResponse<{ user: User }>>(url);
  return response.data;
};

/**
 * Update user profile
 * @param data - Profile data to update
 */
export const updateProfile = async (
  data: { name?: string; email?: string }
): Promise<ApiResponse<{ user: User }>> => {
  const response = await axiosInstance.put<ApiResponse<{ user: User }>>(
    USER_ENDPOINTS.UPDATE_PROFILE,
    data
  );
  return response.data;
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
 * Submit KYC documents
 * @param documents - Object containing local URIs for documents
 */
export const submitKYC = async (
  documents: KYCSubmission
): Promise<ApiResponse<{ kycId: string; status: string }>> => {
  const formData = new FormData();

  const appendFile = (key: string, uri: string | File) => {
    if (typeof uri === 'string') {
      const filename = uri.split('/').pop() || `${key}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      // @ts-ignore
      formData.append(key, { uri, name: filename, type });
    }
  };

  appendFile('driversLicense', documents.driversLicense);
  appendFile('vehicleRegistration', documents.vehicleRegistration);
  appendFile('insurance', documents.insurance);
  appendFile('profilePhoto', documents.profilePhoto);

  const response = await axiosInstance.post<ApiResponse<{ kycId: string; status: string }>>(
    KYC_ENDPOINTS.SUBMIT_KYC,
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
 * Get KYC status
 */
export const getKYCStatus = async (): Promise<ApiResponse<KYCStatusResponse>> => {
  const response = await axiosInstance.get<ApiResponse<KYCStatusResponse>>(
    KYC_ENDPOINTS.GET_KYC_STATUS
  );
  return response.data;
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
