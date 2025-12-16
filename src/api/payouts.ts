import axiosInstance from './axiosInstance';
import { PAYOUTS_ENDPOINTS } from './endpoints';
import { 
  ApiResponse, 
  PayoutRequest, 
  BankAccount, 
  WalletBalance 
} from '../types/api';

/**
 * Request a payout
 * @param amount - Amount to withdraw
 * @param currency - Currency code
 */
export const requestPayout = async (
  amount: number,
  currency: string = 'NGN'
): Promise<ApiResponse<{ payoutId: string; status: string }>> => {
  const response = await axiosInstance.post<ApiResponse<{ payoutId: string; status: string }>>(
    PAYOUTS_ENDPOINTS.REQUEST_PAYOUT,
    { amount, currency }
  );
  return response.data;
};

/**
 * Get payout requests history
 */
export const getPayoutRequests = async (): Promise<ApiResponse<{ payouts: PayoutRequest[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ payouts: PayoutRequest[] }>>(
    PAYOUTS_ENDPOINTS.GET_PAYOUTS
  );
  return response.data;
};

/**
 * Get wallet balance
 */
export const getWalletBalance = async (): Promise<ApiResponse<WalletBalance>> => {
  const response = await axiosInstance.get<ApiResponse<WalletBalance>>(
    PAYOUTS_ENDPOINTS.GET_BALANCE
  );
  return response.data;
};

/**
 * Get earnings report
 * @param from - Start date (ISO string)
 * @param to - End date (ISO string)
 */
export const getEarningsReport = async (
  from?: string,
  to?: string
): Promise<ApiResponse<{ totalEarnings: number; breakdown: any }>> => {
  const response = await axiosInstance.get<ApiResponse<{ totalEarnings: number; breakdown: any }>>(
    PAYOUTS_ENDPOINTS.GET_EARNINGS,
    { params: { from, to } }
  );
  return response.data;
};

/**
 * Add a bank account
 * @param bankName - Name of the bank
 * @param accountNumber - Account number
 * @param accountName - Account holder name
 */
export const addBankAccount = async (
  bankName: string,
  accountNumber: string,
  accountName: string
): Promise<ApiResponse<{ bankAccount: BankAccount }>> => {
  const response = await axiosInstance.post<ApiResponse<{ bankAccount: BankAccount }>>(
    PAYOUTS_ENDPOINTS.ADD_BANK_ACCOUNT,
    { bankName, accountNumber, accountName }
  );
  return response.data;
};

/**
 * Get saved bank accounts
 */
export const getBankAccounts = async (): Promise<ApiResponse<{ bankAccounts: BankAccount[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ bankAccounts: BankAccount[] }>>(
    PAYOUTS_ENDPOINTS.GET_BANK_ACCOUNTS
  );
  return response.data;
};
