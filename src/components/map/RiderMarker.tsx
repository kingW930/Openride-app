import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

interface RiderMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  riderName?: string;
  onPress?: () => void;
}

// This component is now a simple marker representation
// The actual map rendering is done by OpenStreetMap component
export const RiderMarker: React.FC<RiderMarkerProps> = ({
  coordinate,
  riderName,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.marker}>
        <Text style={styles.icon}>📍</Text>
      </View>
      {riderName && <Text style={styles.name}>{riderName}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: COLORS.success,
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
