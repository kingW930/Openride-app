export type UserRole = 'rider' | 'driver';

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  rating?: number;
  kycStatus: KYCStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DriverProfile {
  userId: string;
  licenseNumber: string;
  vehicleId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  licensePlate: string;
  totalTrips: number;
  totalEarnings: number;
  isOnline: boolean;
}

export interface RiderProfile {
  userId: string;
  totalTrips: number;
  preferredPaymentMethod?: string;
}
