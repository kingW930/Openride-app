// User roles - Passenger (rider) and Captain (driver)
export type UserRole = 'PASSENGER' | 'CAPTAIN' | 'ADMIN';

// Multi-step verification status
export type KYCStatus = 
  | 'UNVERIFIED'           // Phone verified only
  | 'IDENTITY_PENDING'      // NIN verification in progress
  | 'IDENTITY_VERIFIED'     // NIN + ID verified
  | 'AFFILIATION_PENDING'   // Work/Student verification in progress
  | 'FULLY_VERIFIED'        // Can book rides as Passenger
  | 'CAPTAIN_PENDING'       // Captain documents pending
  | 'CAPTAIN_VERIFIED'      // Can offer rides as Captain
  | 'REJECTED'              // Verification rejected
  | 'SUSPENDED';            // Account suspended

export interface User {
  id: string;
  phone: string;
  fullName: string;
  email?: string;
  role: UserRole;
  kycStatus: KYCStatus;
  rating?: number;
  isActive: boolean;
  selfieUrl?: string;
  createdAt: string;
  updatedAt: string;
  captainProfile?: CaptainProfile;
}

export interface CaptainProfile {
  id: string;
  licensePhotoUrl?: string;
  vehiclePhotoUrl?: string;
  kycNotes?: string;
  totalTrips: number;
  totalEarnings: number;
}

export interface PassengerProfile {
  userId: string;
  totalTrips: number;
  preferredPaymentMethod?: string;
}

// Verification types
export type GovernmentIdType = 
  | 'NATIONAL_ID'
  | 'NIN_SLIP'
  | 'INTERNATIONAL_PASSPORT'
  | 'VOTERS_CARD'
  | 'DRIVERS_LICENSE';

export type AffiliationType = 'STUDENT' | 'EMPLOYEE';

export type VerificationMethod = 'ID_CARD' | 'EMAIL';

// Verification request DTOs
export interface IdentityVerificationRequest {
  nin: string;
  governmentIdType: GovernmentIdType;
  governmentIdUrl: string;
  selfieUrl: string;
}

export interface AffiliationVerificationRequest {
  affiliationType: AffiliationType;
  organizationName: string;
  verificationMethod: VerificationMethod;
  idCardUrl?: string;
  verificationEmail?: string;
}

export interface CaptainVerificationRequest {
  licenseNumber: string;
  licensePhotoUrl: string;
}

export interface VehicleRequest {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seatsAvailable: number;
  registrationUrl?: string;
  insuranceUrl?: string;
  photoFrontUrl?: string;
  photoBackUrl?: string;
  photoInteriorUrl?: string;
}

// Verification status response (matches backend VerificationStatusResponse.java)
export interface VerificationStatusResponse {
  kycStatus: KYCStatus;
  statusMessage: string;
  canBookRides: boolean;
  canOfferRides: boolean;
  identity: IdentityVerificationStatus;
  affiliation: AffiliationVerificationStatus;
  captain: CaptainVerificationStatus | null;
  vehicles: Vehicle[];
  nextStep: string;
}

export interface IdentityVerificationStatus {
  submitted: boolean;
  verified: boolean;
  ninVerified?: boolean;
  selfieMatchScore?: number;
  rejectionReason: string | null;
  verifiedAt?: string;
}

export interface AffiliationVerificationStatus {
  submitted: boolean;
  verified: boolean;
  affiliationType: AffiliationType | null;
  organizationName?: string;
  verificationMethod: VerificationMethod | null;
  emailVerified?: boolean;
  rejectionReason: string | null;
  verifiedAt?: string;
}

export interface CaptainVerificationStatus {
  submitted: boolean;
  verified: boolean;
  licenseVerified?: boolean;
  licenseExpiryDate?: string;
  hasVehicle?: boolean;
  rejectionReason: string | null;
  verifiedAt?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seatsAvailable: number;
  isVerified: boolean;
  isActive: boolean;
}

// Helper functions
export const isPassenger = (role: UserRole | undefined): boolean => 
  role === 'PASSENGER';

export const isCaptain = (role: UserRole | undefined): boolean => 
  role === 'CAPTAIN';

export const canBookRides = (kycStatus: KYCStatus | undefined): boolean => 
  kycStatus === 'FULLY_VERIFIED' || 
  kycStatus === 'CAPTAIN_PENDING' ||
  kycStatus === 'CAPTAIN_VERIFIED';

export const canOfferRides = (kycStatus: KYCStatus | undefined): boolean => 
  kycStatus === 'CAPTAIN_VERIFIED';

export const requiresVerification = (kycStatus: KYCStatus | undefined): boolean =>
  kycStatus !== 'FULLY_VERIFIED' && 
  kycStatus !== 'CAPTAIN_VERIFIED' &&
  kycStatus !== 'SUSPENDED';

export const needsIdentityVerification = (kycStatus: KYCStatus | undefined): boolean =>
  kycStatus === 'UNVERIFIED';

export const needsAffiliationVerification = (kycStatus: KYCStatus | undefined): boolean =>
  kycStatus === 'IDENTITY_VERIFIED';

export const needsCaptainVerification = (role: UserRole | undefined, kycStatus: KYCStatus | undefined): boolean =>
  role === 'CAPTAIN' && kycStatus === 'FULLY_VERIFIED';
