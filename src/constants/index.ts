// src/constants/index.ts
export * from './colors';

export const SPACING = {
  xs: 6, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48,
};

export const FONT_SIZE = {
  xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 22, '2xl': 24, '3xl': 28, xxxl: 32, '4xl': 36
};

export const FONT_WEIGHT = { 
  thin: '200',
  light: '300',
  regular: '400', 
  medium: '500', 
  semibold: '600', 
  bold: '700',
  extrabold: '800',
  black: '900'
} as const;

export const RADIUS = { sm: 6, md: 10, lg: 14, xl: 18, xxl: 24, full: 9999 };

export const BORDER_RADIUS = RADIUS; // Alias

export const BUTTON_HEIGHT = { sm: 36, md: 48, lg: 56 };

export const INPUT_HEIGHT = { sm: 40, md: 48, lg: 56 };

export const BORDER_WIDTH = { thin: 1, medium: 2, thick: 3 };

export const SHADOW = { 
  sm: { shadowColor: '#000', shadowOffset: {width:0,height:3}, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: {width:0,height:5}, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  xl: { shadowColor: '#000', shadowOffset: {width:0,height:8}, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 }
};

export const GRADIENTS = {
  primary: ['#FF6B35', '#E55A2A'],
  secondary: ['#64748B', '#475569'],
  success: ['#10B981', '#059669'],
};

export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
};
