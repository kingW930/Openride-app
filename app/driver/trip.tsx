import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';
import { useDriverStore } from '@/store/driverStore';
import { getRoute } from '@/utils/getRoute';
import * as Location from 'expo-location';

export default function DriverTrip() {
  const { activeTrip, completeTrip } = useDriverStore();
  const [coords, setCoords] = useState<any[]>([]);
  const [driverLocation, setDriverLocation] = useState<any>(null);

  useEffect(() => {
    let sub: any;
    async function track() {
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 3 },
        async (loc) => {
          setDriverLocation(loc.coords);
          // TODO: emit to backend → socketService.emit("driver:location", loc.coords);
          const { coords } = await getRoute(
            loc.coords,
            { latitude: activeTrip.pickup.latitude, longitude: activeTrip.pickup.longitude }
          );
          setCoords(coords);
        }
      );
    }
    track();
    return () => sub?.remove();
  }, []);

  if (!activeTrip) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView 
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
      >
        {driverLocation && <Marker coordinate={driverLocation} title="You" pinColor="blue" />}
        <Marker coordinate={activeTrip.pickup} title="Pickup" pinColor="green" />
        {coords.length > 1 && (
          <Polyline strokeWidth={4} strokeColor={COLORS.primary} coordinates={coords} />
        )}
      </MapView>

      <View style={styles.card}>
        <Text style={styles.title}>Active Trip</Text>
        <Text style={styles.sub}>{activeTrip.riderName}</Text>
        <Text style={styles.sub}>Pickup: {activeTrip.pickup.address}</Text>
        <Pressable
          style={styles.btn}
          onPress={() => completeTrip()}
        >
          <Text style={{ color: '#fff' }}>Complete Trip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', left: 0, right: 0, bottom: 0 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  sub: { marginTop: 4, color: COLORS.textSecondary },
  btn: { marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center' },
});
