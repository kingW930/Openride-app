// src/components/map/RideMap.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Feather';
import { socketService } from '@/services/socket';
import { COLORS } from '@/constants';

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

export const RideMap: React.FC<RideMapProps> = ({ userLocation, showDrivers = true, style, zoom = 0.012 }) => {
  const mapRef = useRef<MapView | null>(null);
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
        // payload: { id, latitude, longitude, heading?, meta? }
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

  useEffect(() => {
    // optionally center map on user location when available
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: zoom,
        longitudeDelta: zoom,
      });
    }
  }, [userLocation]);

  if (!userLocation && !connected) {
    return (
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, style]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <MapView
      ref={(r) => (mapRef.current = r)}
      style={[{ flex: 1 }, style]}
      initialRegion={
        userLocation
          ? { latitude: userLocation.latitude, longitude: userLocation.longitude, latitudeDelta: zoom, longitudeDelta: zoom }
          : { latitude: 6.5244, longitude: 3.3792, latitudeDelta: zoom, longitudeDelta: zoom }
      }
      showsUserLocation={!!userLocation}
      showsMyLocationButton={true}
    >
      {showDrivers && Object.values(drivers).map((d) => (
        <Marker
          key={d.id}
          coordinate={{ latitude: d.lat, longitude: d.lon }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Icon name="truck" size={26} color={COLORS.primary} />
        </Marker>
      ))}
    </MapView>
  );
};

export default RideMap;
