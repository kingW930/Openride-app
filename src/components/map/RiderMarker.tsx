import React from 'react';
import { Marker } from 'react-native-maps';
import { colors } from '../../constants';

interface RiderMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  riderName?: string;
  onPress?: () => void;
}

export const RiderMarker: React.FC<RiderMarkerProps> = ({
  coordinate,
  riderName,
  onPress,
}) => {
  return (
    <Marker
      coordinate={coordinate}
      title={riderName || 'Rider'}
      description="Pickup location"
      pinColor={colors.success}
      onPress={onPress}
    />
  );
};
