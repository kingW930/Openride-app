import axiosInstance from './axiosInstance';
import { PAYMENT_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  InitiatePaymentResponse, 
  Payment, 
  PaymentStatus, 
  PaginatedResponse 
} from '../types/api';

/**
 * Initialize payment for a booking
 * @param bookingId - The booking ID to pay for
 * @param amount - Amount to pay
 * @param currency - Currency code (e.g., NGN)
 * @param idempotencyKey - Unique key to prevent duplicate charges
 */
export const initiatePayment = async (
  bookingId: string,
  amount: number,
  currency: string = 'NGN',
  idempotencyKey: string
): Promise<ApiResponse<InitiatePaymentResponse>> => {
  const response = await axiosInstance.post<ApiResponse<InitiatePaymentResponse>>(
    PAYMENT_ENDPOINTS.INITIATE_PAYMENT,
    { bookingId, amount, currency, idempotencyKey }
  );
  return response.data;
};

/**
 * Verify payment status
 * @param paymentId - The payment ID
 * @param transactionRef - The transaction reference from the gateway
 */
export const verifyPayment = async (
  paymentId: string,
  transactionRef: string
): Promise<ApiResponse<{ verified: boolean; payment: Payment }>> => {
  const url = PAYMENT_ENDPOINTS.VERIFY_PAYMENT.replace(':id', paymentId);
  const response = await axiosInstance.post<ApiResponse<{ verified: boolean; payment: Payment }>>(
    url,
    { transactionRef }
  );
  return response.data;
};

/**
 * Get payment status
 * @param paymentId - The payment ID
 */
export const getPaymentStatus = async (
  paymentId: string
): Promise<ApiResponse<{ status: PaymentStatus; transaction: any }>> => {
  const url = PAYMENT_ENDPOINTS.GET_PAYMENT_STATUS.replace(':id', paymentId);
  const response = await axiosInstance.get<ApiResponse<{ status: PaymentStatus; transaction: any }>>(url);
  return response.data;
};

/**
 * Get payment history
 * @param page - Page number
 * @param limit - Items per page
 */
export const getPaymentHistory = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<PaginatedResponse<Payment>>> => {
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Payment>>>(
    PAYMENT_ENDPOINTS.GET_PAYMENT_HISTORY,
    { params: { page, limit } }
  );
  return response.data;
};

/**
 * Request a refund
 * @param paymentId - The payment ID
 * @param reason - Reason for refund
 */
export const requestRefund = async (
  paymentId: string,
  reason: string
): Promise<ApiResponse<{ refund: any }>> => {
  const url = PAYMENT_ENDPOINTS.REQUEST_REFUND.replace(':id', paymentId);
  const response = await axiosInstance.post<ApiResponse<{ refund: any }>>(
    url,
    { reason }
  );
  return response.data;
};
