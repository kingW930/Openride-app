// Spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Font sizes
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  xxl: 24,
  xxxl: 32,
  '4xl': 40,
};

// Font weights
export const FONT_WEIGHT = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 999,
};

// Alias for BORDER_RADIUS
export const RADIUS = BORDER_RADIUS;

// Border widths
export const BORDER_WIDTH = {
  thin: 1,
  medium: 2,
  thick: 3,
};

// Button heights
export const BUTTON_HEIGHT = {
  sm: 36,
  md: 48,
  lg: 56,
};

// Input heights
export const INPUT_HEIGHT = {
  sm: 36,
  md: 48,
  lg: 56,
};

// Icon sizes
export const ICON_SIZE = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
};

// Shadow
export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 12,
  },
};

// Legacy export for backward compatibility
export const sizes = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontMd: 16,
  fontLg: 18,
  fontXl: 24,
  fontXxl: 32,
  
  // Border radius
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusFull: 999,
  
  // Icon sizes
  iconSm: 16,
  iconMd: 24,
  iconLg: 32,
};
