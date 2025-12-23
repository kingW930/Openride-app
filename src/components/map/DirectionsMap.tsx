// src/components/map/DirectionsMap.tsx
// Enhanced Google Maps with turn-by-turn directions
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS } from '@/constants';

interface Location {
  latitude: number;
  longitude: number;
}

interface DirectionsMapProps {
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  onReady?: (result: any) => void;
  style?: any;
  showUserLocation?: boolean;
}

export function DirectionsMap({
  origin,
  destination,
  waypoints = [],
  onReady,
  style,
  showUserLocation = true,
}: DirectionsMapProps) {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const GOOGLE_MAPS_APIKEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    if (!loading && mapRef.current) {
      // Fit to show entire route
      const coordinates = [origin, ...waypoints, destination];
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [loading]);

  if (!GOOGLE_MAPS_APIKEY) {
    console.warn('Google Maps API key not configured. Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to .env');
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      initialRegion={{
        latitude: (origin.latitude + destination.latitude) / 2,
        longitude: (origin.longitude + destination.longitude) / 2,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={true}
      showsCompass={true}
      loadingEnabled={true}
    >
      {/* Origin marker */}
      <Marker
        coordinate={origin}
        title="Pickup"
        pinColor="#10B981"
      />

      {/* Destination marker */}
      <Marker
        coordinate={destination}
        title="Drop-off"
        pinColor="#EF4444"
      />

      {/* Waypoints */}
      {waypoints.map((waypoint, index) => (
        <Marker
          key={`waypoint-${index}`}
          coordinate={waypoint}
          title={`Stop ${index + 1}`}
          pinColor="#F59E0B"
        />
      ))}

      {/* Directions polyline */}
      {GOOGLE_MAPS_APIKEY && (
        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor={COLORS.primary}
          optimizeWaypoints={true}
          onReady={(result) => {
            setLoading(false);
            onReady?.(result);
          }}
          onError={(errorMessage) => {
            console.error('Directions error:', errorMessage);
            setLoading(false);
          }}
        />
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
