// src/components/ui/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, BUTTON_HEIGHT, SHADOW } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    isDisabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  
  // Variants - Professional style
  primary: {
    backgroundColor: COLORS.primary, // Deep orange
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowOpacity: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  
  // Sizes
  sm: {
    height: BUTTON_HEIGHT.sm,
    paddingHorizontal: SPACING.md,
  },
  md: {
    height: BUTTON_HEIGHT.md,
  },
  lg: {
    height: BUTTON_HEIGHT.lg,
    paddingHorizontal: SPACING.xl,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text Styles
  text: {
    fontWeight: FONT_WEIGHT.semibold,
  },
  text_primary: {
    color: COLORS.white,
  },
  text_secondary: {
    color: COLORS.white,
  },
  text_outline: {
    color: COLORS.textPrimary,
  },
  text_ghost: {
    color: COLORS.primary,
  },
  text_danger: {
    color: COLORS.white,
  },
  text_sm: {
    fontSize: FONT_SIZE.sm,
  },
  text_md: {
    fontSize: FONT_SIZE.md,
  },
  text_lg: {
    fontSize: FONT_SIZE.lg,
  },
  textDisabled: {
    opacity: 0.7,
  },
});