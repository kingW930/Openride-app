import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

interface DriverMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  heading?: number;
  driverName?: string;
  onPress?: () => void;
}

// This component is now a simple marker representation
// The actual map rendering is done by OpenStreetMap component
export const DriverMarker: React.FC<DriverMarkerProps> = ({
  coordinate,
  heading = 0,
  driverName,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.marker}>
        <Text style={styles.icon}>🚗</Text>
      </View>
      {driverName && <Text style={styles.name}>{driverName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  icon: {
    fontSize: 16,
  },
  name: {
    fontSize: 10,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
});
