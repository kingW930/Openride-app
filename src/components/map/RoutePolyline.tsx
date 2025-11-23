import React from 'react';
import { Polyline } from 'react-native-maps';
import { colors } from '../../constants';

interface RoutePolylineProps {
  coordinates: Array<{
    latitude: number;
    longitude: number;
  }>;
  strokeColor?: string;
  strokeWidth?: number;
}

export const RoutePolyline: React.FC<RoutePolylineProps> = ({
  coordinates,
  strokeColor = colors.primary,
  strokeWidth = 4,
}) => {
  if (coordinates.length < 2) {
    return null;
  }

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      lineCap="round"
      lineJoin="round"
    />
  );
};
