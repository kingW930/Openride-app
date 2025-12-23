import axiosInstance from './axiosInstance';
import { AUTH_ENDPOINTS } from './endpoints';
import { ApiResponse, User } from '../types/api';

export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export interface VerifyOTPResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser?: boolean;
}

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phone: string): Promise<SendOTPResponse> => {
  const response = await axiosInstance.post<SendOTPResponse>(
    AUTH_ENDPOINTS.SEND_OTP, 
    { phone }
  );
  return response.data;
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (phone: string, code: string): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<VerifyOTPResponse>(
    AUTH_ENDPOINTS.VERIFY_OTP, 
    { phone, code }
  );
  return response.data;
};

/**
 * Register new user (Note: This is typically handled via OTP verification in backend)
 */
export const registerUser = async (data: {
  phone: string;
  name: string;
  email?: string;
  role: 'rider' | 'driver';
}): Promise<{ user: User; accessToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ user: User; accessToken: string }>>(
    AUTH_ENDPOINTS.REGISTER, 
    data
  );
  return response.data.data;
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    AUTH_ENDPOINTS.REFRESH_TOKEN, 
    { refreshToken }
  );
  return response.data.data;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<ApiResponse<User>>(
    '/v1/users/me'
  );
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  await axiosInstance.post(AUTH_ENDPOINTS.LOGOUT);
};
