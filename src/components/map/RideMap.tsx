import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { colors, sizes } from '../../constants';

interface Location {
  latitude: number;
  longitude: number;
}

interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface RideMapProps {
  userLocation: Location | null;
  driverLocation?: Location | null;
  stops?: Stop[];
  polyline?: Location[];
  onRegionChange?: (region: Region) => void;
  showRecenterButton?: boolean;
}

export const RideMap: React.FC<RideMapProps> = ({
  userLocation,
  driverLocation,
  stops = [],
  polyline = [],
  onRegionChange,
  showRecenterButton = true,
}) => {
  const mapRef = useRef<MapView>(null);
  const [hasManuallyPanned, setHasManuallyPanned] = useState(false);

  useEffect(() => {
    if (!hasManuallyPanned && userLocation) {
      recenterMap();
    }
  }, [userLocation, driverLocation]);

  const recenterMap = () => {
    if (!mapRef.current) return;

    const coordinates: Location[] = [];
    if (userLocation) coordinates.push(userLocation);
    if (driverLocation) coordinates.push(driverLocation);
    stops.forEach(stop => coordinates.push({ latitude: stop.lat, longitude: stop.lon }));

    if (coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
      setHasManuallyPanned(false);
    }
  };

  const handleRegionChangeComplete = (region: Region) => {
    setHasManuallyPanned(true);
    onRegionChange?.(region);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* Driver marker */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Driver"
            pinColor={colors.primary}
          />
        )}

        {/* Stop markers */}
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={{ latitude: stop.lat, longitude: stop.lon }}
            title={stop.name}
            pinColor={colors.secondary}
          />
        ))}

        {/* Route polyline */}
        {polyline.length > 1 && (
          <Polyline
            coordinates={polyline}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Recenter button */}
      {showRecenterButton && hasManuallyPanned && (
        <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
          <Text style={styles.recenterText}>⊙</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  recenterButton: {
    position: 'absolute',
    right: sizes.md,
    bottom: sizes.xl,
    backgroundColor: colors.white,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recenterText: {
    fontSize: 24,
    color: colors.primary,
  },
});
