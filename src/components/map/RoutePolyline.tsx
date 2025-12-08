import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

interface RoutePolylineProps {
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  strokeColor?: string;
  strokeWidth?: number;
}

// This component is now a placeholder
// Route rendering is handled by OpenStreetMap component
export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  coordinates,
  strokeColor = COLORS.primary,
  strokeWidth = 4,
}) => {
  // The actual polyline is rendered inside OpenStreetMap
  // This component is kept for API compatibility
  return null;
};

const styles = StyleSheet.create({});
