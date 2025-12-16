import axiosInstance from './axiosInstance';
import { NOTIFICATION_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  Notification, 
  NotificationSettings 
} from '../types/api';

/**
 * Register device for push notifications
 * @param token - FCM token
 * @param platform - 'ios' or 'android'
 */
export const registerDevice = async (
  token: string,
  platform: 'ios' | 'android'
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
    NOTIFICATION_ENDPOINTS.REGISTER_DEVICE,
    { token, platform }
  );
  return response.data;
};

/**
 * Get user notifications
 */
export const getNotifications = async (
  page: number = 1,
  limit: number = 20,
  unreadOnly: boolean = false
): Promise<ApiResponse<{ notifications: Notification[]; unreadCount: number }>> => {
  const response = await axiosInstance.get<ApiResponse<{ notifications: Notification[]; unreadCount: number }>>(
    NOTIFICATION_ENDPOINTS.GET_NOTIFICATIONS,
    { params: { page, limit, unreadOnly } }
  );
  return response.data;
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId: string): Promise<ApiResponse<{ success: boolean }>> => {
  const url = NOTIFICATION_ENDPOINTS.MARK_READ.replace(':id', notificationId);
  const response = await axiosInstance.put<ApiResponse<{ success: boolean }>>(url);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllRead = async (): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await axiosInstance.put<ApiResponse<{ success: boolean }>>(
    NOTIFICATION_ENDPOINTS.MARK_ALL_READ
  );
  return response.data;
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  settings: NotificationSettings
): Promise<ApiResponse<{ settings: NotificationSettings }>> => {
  const response = await axiosInstance.put<ApiResponse<{ settings: NotificationSettings }>>(
    NOTIFICATION_ENDPOINTS.UPDATE_SETTINGS,
    settings
  );
  return response.data;
};
