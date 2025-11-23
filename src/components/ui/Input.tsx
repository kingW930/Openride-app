import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE, RADIUS, INPUT_HEIGHT, BORDER_WIDTH } from '@/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon && <Text style={styles.icon}>{icon}</Text>}
        
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, style]}
          placeholderTextColor={COLORS.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      
      {error && <Text style={styles.error}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary, // White text
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated, // Dark gray background
    borderWidth: BORDER_WIDTH.thin,
    borderColor: COLORS.border, // Dark border
    borderRadius: RADIUS.md,
    height: INPUT_HEIGHT.md,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary, // Orange when focused
    borderWidth: BORDER_WIDTH.medium,
    backgroundColor: COLORS.surface, // Slightly lighter when focused
  },
  inputContainerError: {
    borderColor: COLORS.error, // Red on error
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary, // White text
    paddingHorizontal: SPACING.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  icon: {
    fontSize: 20,
    paddingLeft: SPACING.md,
  },
  error: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});