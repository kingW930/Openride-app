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
 * Note: Backend wraps response in ApiResponse, we extract the data
 */
export const sendOTP = async (phone: string): Promise<SendOTPResponse> => {
  const response = await axiosInstance.post<ApiResponse<SendOTPResponse>>(
    AUTH_ENDPOINTS.SEND_OTP, 
    { phone }
  );
  return response.data.data;
};

/**
 * Verify OTP code
 * Note: Backend wraps response in ApiResponse, we extract the data
 */
export const verifyOTP = async (phone: string, code: string): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post<ApiResponse<VerifyOTPResponse>>(
    AUTH_ENDPOINTS.VERIFY_OTP, 
    { phone, code }
  );
  return response.data.data;
};

/**
 * Register new user (Note: This is typically handled via OTP verification in backend)
 */
export const registerUser = async (data: {
  phone: string;
  name: string;
  email?: string;
  role: 'PASSENGER' | 'CAPTAIN';
}): Promise<{ user: User; accessToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ user: User; accessToken: string }>>(
    AUTH_ENDPOINTS.REGISTER, 
    data
  );
  return response.data.data;
};

/**
 * Refresh access token
 * Note: Backend only returns new accessToken, not a new refreshToken
 */
export const refreshToken = async (refreshTokenValue: string): Promise<{ accessToken: string }> => {
  const response = await axiosInstance.post<ApiResponse<{ accessToken: string }>>(
    AUTH_ENDPOINTS.REFRESH_TOKEN, 
    { refreshToken: refreshTokenValue }
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
