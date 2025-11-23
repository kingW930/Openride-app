import { sendOTP, verifyOTP } from '../auth';
import axiosInstance from '../axiosInstance';

jest.mock('../axiosInstance');

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendOTP', () => {
    it('should send OTP successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'OTP sent successfully',
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await sendOTP('+2341234567890');

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/send-otp', {
        phone: '+2341234567890',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('verifyOTP', () => {
    it('should verify OTP successfully', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token',
          user: {
            id: '1',
            name: 'Test User',
            phone: '+2341234567890',
            role: 'rider',
            kycStatus: 'VERIFIED',
          },
        },
      };

      (axiosInstance.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await verifyOTP('+2341234567890', '123456');

      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/verify-otp', {
        phone: '+2341234567890',
        code: '123456',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
