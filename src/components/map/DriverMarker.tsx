import React from 'react';
import { Marker } from 'react-native-maps';
import { colors } from '../../constants';

interface DriverMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  heading?: number;
  driverName?: string;
  onPress?: () => void;
}

export const DriverMarker: React.FC<DriverMarkerProps> = ({
  coordinate,
  heading = 0,
  driverName,
  onPress,
}) => {
  return (
    <Marker
      coordinate={coordinate}
      title={driverName || 'Driver'}
      description="Your driver"
      pinColor={colors.primary}
      rotation={heading}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={onPress}
    >
      {/* Custom car icon can be added here */}
    </Marker>
  );
};
