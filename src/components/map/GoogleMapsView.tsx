// src/components/map/GoogleMapsView.tsx
import React, { useRef, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { COLORS } from '@/constants';

interface MarkerData {
  id: string | number;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
  type?: 'driver' | 'pickup' | 'destination' | 'user';
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface GoogleMapsViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: MarkerData[];
  style?: any;
  showUserLocation?: boolean;
  route?: RoutePoint[];
  routeColor?: string;
  onMarkerPress?: (marker: MarkerData) => void;
}

export function GoogleMapsView({
  latitude,
  longitude,
  zoom = 14,
  markers = [],
  style,
  showUserLocation = false,
  route = [],
  routeColor = COLORS.primary,
  onMarkerPress,
}: GoogleMapsViewProps) {
  const mapRef = useRef<MapView>(null);

  // Fit to route when route changes
  useEffect(() => {
    if (route.length > 1 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(route, {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [route]);

  // Get marker color based on type
  const getMarkerColor = (type?: string): string => {
    switch (type) {
      case 'driver':
        return '#FF6B35';
      case 'pickup':
        return '#10B981';
      case 'destination':
        return '#EF4444';
      case 'user':
        return COLORS.primary;
      default:
        return COLORS.primary;
    }
  };

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.0922 / (zoom / 10),
        longitudeDelta: 0.0421 / (zoom / 10),
      }}
      showsUserLocation={showUserLocation}
      showsMyLocationButton={true}
      showsCompass={true}
      showsTraffic={false}
      loadingEnabled={true}
      zoomEnabled={true}
      scrollEnabled={true}
      pitchEnabled={false}
      rotateEnabled={false}
    >
      {/* Render route polyline */}
      {route.length > 1 && (
        <Polyline
          coordinates={route}
          strokeColor={routeColor}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {/* Render markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          pinColor={getMarkerColor(marker.type)}
          onPress={() => onMarkerPress?.(marker)}
        />
      ))}

      {/* User location circle (if enabled and not using showsUserLocation) */}
      {showUserLocation && (
        <Circle
          center={{ latitude, longitude }}
          radius={30}
          fillColor="rgba(66, 133, 244, 0.2)"
          strokeColor="rgba(66, 133, 244, 0.5)"
          strokeWidth={2}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
