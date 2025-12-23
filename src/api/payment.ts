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
 * @param customerEmail - Customer email for receipt
 * @param customerName - Customer name
 * @param currency - Currency code (e.g., NGN)
 * @param idempotencyKey - Unique key to prevent duplicate charges
 */
export const initiatePayment = async (
  bookingId: string,
  amount: number,
  customerEmail: string,
  customerName: string,
  currency: string = 'NGN',
  idempotencyKey: string
): Promise<Payment> => {
  const response = await axiosInstance.post<Payment>(
    PAYMENT_ENDPOINTS.INITIATE_PAYMENT,
    { bookingId, amount, currency, customerEmail, customerName, idempotencyKey }
  );
  return response.data;
};

/**
 * Verify payment status (manual check)
 * @param paymentId - The payment ID
 */
export const verifyPayment = async (
  paymentId: string
): Promise<Payment> => {
  const url = `/v1/payments/${paymentId}/verify`;
  const response = await axiosInstance.post<Payment>(url);
  return response.data;
};

/**
 * Get payment details
 * @param paymentId - The payment ID
 */
export const getPayment = async (
  paymentId: string
): Promise<Payment> => {
  const url = `/v1/payments/${paymentId}`;
  const response = await axiosInstance.get<Payment>(url);
  return response.data;
};

/**
 * Get payment history
 * @returns List of user's payments
 */
export const getPaymentHistory = async (): Promise<Payment[]> => {
  const response = await axiosInstance.get<Payment[]>('/v1/payments/my-payments');
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
