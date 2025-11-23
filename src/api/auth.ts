import axiosInstance from './axiosInstance';
import { User } from '../types/user';

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  token: string;
  user: User;
}

export const sendOTP = async (phone: string): Promise<SendOTPResponse> => {
  const response = await axiosInstance.post('/v1/auth/send-otp', { phone });
  return response.data;
};

export const verifyOTP = async (phone: string, code: string): Promise<VerifyOTPResponse> => {
  const response = await axiosInstance.post('/v1/auth/verify-otp', { phone, code });
  return response.data;
};

export const registerUser = async (data: {
  phone: string;
  name: string;
  email?: string;
  role: 'rider' | 'driver';
}): Promise<User> => {
  const response = await axiosInstance.post('/v1/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/v1/auth/logout');
};
