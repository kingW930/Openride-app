// src/constants/colors.ts
/**
 * Open Ride Professional Color System
 * Clean, minimal, professional orange theme
 */

export const COLORS = {
  // Primary Brand Colors - Professional Orange (Material Design Deep Orange)
  primary: '#D84315',        // Deep burnt orange - main CTA
  primaryDark: '#BF360C',    // Darker for pressed states
  primaryLight: '#FF6E40',   // Lighter for highlights
  primaryAlpha: 'rgba(216, 67, 21, 0.08)', // Very subtle background
  
  // Secondary Orange Shades
  secondary: '#FF5722',      // Material orange
  secondaryDark: '#E64A19',  
  secondaryLight: '#FF8A65',
  secondaryAlpha: 'rgba(255, 87, 34, 0.08)',
  
  // Accent for highlights
  accent: '#FF6E40',         // Accent orange
  accentDark: '#FF3D00',
  accentLight: '#FF9E80',
  
  // Status Colors (Material Design)
  success: '#4CAF50',        // Green
  warning: '#FF9800',        // Amber
  error: '#F44336',          // Red
  info: '#2196F3',           // Blue
  
  // Neutral Grays (Material Design - Light Theme)
  black: '#000000',
  gray900: '#212121',        // Primary text
  gray800: '#424242',        
  gray700: '#616161',        
  gray600: '#757575',        // Secondary text
  gray500: '#9E9E9E',        
  gray400: '#BDBDBD',        
  gray300: '#E0E0E0',        // Borders
  gray200: '#EEEEEE',        // Dividers
  gray100: '#F5F5F5',        // Background
  gray50: '#FAFAFA',         // Cards/Surface
  white: '#FFFFFF',          // Pure white
  
  // Background Colors - Light Theme
  background: '#F5F5F5',            // Main background (light gray)
  backgroundSecondary: '#FAFAFA',   // Secondary background
  backgroundTertiary: '#FFFFFF',    // Elevated surfaces
  
  // Surface Colors (Cards, Modals)
  surface: '#FFFFFF',               // Card background
  surfaceElevated: '#FFFFFF',       // Elevated cards
  surfaceDark: '#FAFAFA',          // Subtle surfaces
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Text Colors - Light Theme
  text: '#212121',                      // Alias for textPrimary
  textLight: '#9E9E9E',                 // Alias for textTertiary
  textPrimary: '#212121',               // Main text (dark gray)
  textSecondary: '#757575',             // Secondary text (medium gray)
  textTertiary: '#9E9E9E',              // Tertiary text (light gray)
  textDisabled: '#BDBDBD',              // Disabled text
  textOnPrimary: '#FFFFFF',             // White text on orange
  textOnSecondary: '#FFFFFF',       
  textOnAccent: '#FFFFFF',
  textLink: '#D84315',                  // Orange links
  
  // Border Colors
  border: '#E0E0E0',                // Default border (light gray)
  borderDark: '#BDBDBD',            // Darker border
  borderLight: '#EEEEEE',           // Lighter border
  divider: '#EEEEEE',               // Divider lines
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.08)',    // Subtle shadows
  shadowMedium: 'rgba(0, 0, 0, 0.12)',
  shadowStrong: 'rgba(0, 0, 0, 0.16)',
  
  // Map Colors
  mapRoute: '#D84315',              // Orange route
  mapRouteActive: '#4CAF50',        // Green active
  mapDriverMarker: '#FF5722',       // Orange marker
  mapRiderMarker: '#2196F3',        // Blue marker
  mapPickup: '#4CAF50',             // Green pickup
  mapDestination: '#F44336',        // Red destination
  
  // Status Badge Colors (Light backgrounds)
  statusConfirmedBg: '#E3F2FD',     // Light blue
  statusConfirmedText: '#1976D2',   // Dark blue
  statusPendingBg: '#FFF3E0',       // Light orange
  statusPendingText: '#E65100',     // Dark orange
  statusCancelledBg: '#FFEBEE',     // Light red
  statusCancelledText: '#C62828',   // Dark red
  statusCompletedBg: '#E8F5E9',     // Light green
  statusCompletedText: '#2E7D32',   // Dark green
  
  // Semantic UI States
  online: '#4CAF50',
  offline: '#9E9E9E',
  inProgress: '#FF9800',
  completed: '#4CAF50',
  cancelled: '#F44336',
};

// Professional Gradient Definitions
export const GRADIENTS = {
  primary: ['#D84315', '#BF360C'],           // Deep orange gradient
  secondary: ['#FF5722', '#E64A19'],         // Orange gradient
  accent: ['#FF6E40', '#FF3D00'],            // Accent gradient
  subtle: ['#FAFAFA', '#F5F5F5'],           // Subtle gray gradient
};

// Legacy export for backward compatibility
export const colors = {
  // Brand colors
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  accent: COLORS.accent,
  
  // Status colors
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.error,  // Map danger to error
  error: COLORS.error,
  info: COLORS.info,
  
  // Background colors
  background: COLORS.background,
  light: COLORS.gray100,
  white: COLORS.white,
  black: COLORS.black,
  
  // Text colors
  text: COLORS.textPrimary,
  textSecondary: COLORS.textSecondary,
  
  // Grays
  gray: COLORS.gray500,
  border: COLORS.border,
};

export default COLORS;