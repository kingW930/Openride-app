// src/components/map/RideMap.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { socketService } from '@/services/socket';
import { COLORS } from '@/constants';
import { GoogleMapsView } from './GoogleMapsView';

interface RideMapProps {
  userLocation?: { latitude: number; longitude: number } | null;
  showDrivers?: boolean;
  style?: any;
  zoom?: number;
}

type DriverMarker = {
  id: string;
  lat: number;
  lon: number;
  heading?: number;
  meta?: any;
};

export const RideMap: React.FC<RideMapProps> = ({ userLocation, showDrivers = true, style, zoom = 14 }) => {
  const [drivers, setDrivers] = useState<Record<string, DriverMarker>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await socketService.connect();
      if (!mounted) return;
      setConnected(socketService.isConnected());

      // Listen for driver locations
      const onDriverLocation = (payload: any) => {
        setDrivers(prev => ({
          ...prev,
          [payload.id]: { id: payload.id, lat: payload.latitude, lon: payload.longitude, heading: payload.heading, meta: payload.meta },
        }));
      };

      socketService.on('driver:location', onDriverLocation);

      // Also listen for driver disconnect (optional)
      socketService.on('driver:offline', (payload: any) => {
        setDrivers(prev => {
          const copy = { ...prev };
          delete copy[payload.id];
          return copy;
        });
      });

      // cleanup
      return () => {
        socketService.off('driver:location', onDriverLocation);
        socketService.off('driver:offline');
      };
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!userLocation && !connected) {
    return (
      <View style={[styles.loading, style]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Convert drivers to markers format
  const driverMarkers = showDrivers
    ? Object.values(drivers).map(d => ({
        id: d.id,
        latitude: d.lat,
        longitude: d.lon,
        title: `Driver ${d.id}`,
        type: 'driver' as const,
      }))
    : [];

  return (
    <GoogleMapsView
      latitude={userLocation?.latitude || 6.5244}
      longitude={userLocation?.longitude || 3.3792}
      zoom={zoom}
      markers={driverMarkers}
      showUserLocation={!!userLocation}
      style={[styles.map, style]}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RideMap;
