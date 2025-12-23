export type UserRole = 'RIDER' | 'DRIVER' | 'ADMIN';

export type KYCStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface User {
  id: string;
  phone: string;
  fullName: string;
  email?: string;
  role: UserRole;
  kycStatus: KYCStatus;
  rating?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  driverProfile?: DriverProfile;
}

export interface DriverProfile {
  id: string;
  licensePhotoUrl?: string;
  vehiclePhotoUrl?: string;
  kycNotes?: string;
  totalTrips: number;
  totalEarnings: number;
}

export interface RiderProfile {
  userId: string;
  totalTrips: number;
  preferredPaymentMethod?: string;
}
