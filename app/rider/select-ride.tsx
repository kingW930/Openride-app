import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRiderStore } from '@/store/riderStore';
import { getRoute } from '@/utils/getRoute';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';

/** Replace these with real API and socket */
const mockDrivers = [
  { id: 'DV1', name: 'Sarah', lat: 6.5254, lon: 3.3768 },
  { id: 'DV2', name: 'Anthony', lat: 6.5231, lon: 3.3809 },
];

export default function SelectRide() {
  const router = useRouter();
  const { setCurrentTrip, pickup, destination } = useRiderStore();
  const [region, setRegion] = useState({
    latitude: pickup?.latitude || 6.5244,
    longitude: pickup?.longitude || 3.3792,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  const [nearest, setNearest] = useState<typeof mockDrivers[0] | null>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [eta, setEta] = useState<string | null>(null);

  async function findNearestDriver() {
    if (!pickup) return Alert.alert("Set pickup first");

    // pick closest driver
    let best = mockDrivers[0];
    let bestDist = Infinity;

    for (let d of mockDrivers) {
      const dx = d.lat - pickup.latitude;
      const dy = d.lon - pickup.longitude;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        best = d;
        bestDist = dist;
      }
    }

    setNearest(best);

    const { coords, eta } = await getRoute(
      { latitude: pickup.latitude, longitude: pickup.longitude },
      { latitude: best.lat, longitude: best.lon }
    );

    setRouteCoords(coords);
    setEta(eta);
  }

  function confirmBooking() {
    if (!nearest) return Alert.alert("Select nearest driver first");
    if (!pickup || !destination) return Alert.alert("Pickup and destination required");

    const trip = {
      id: `TR-${Date.now()}`,
      pickup: pickup,
      destination: destination,
      status: 'pending' as const,
      fare: Math.floor(Math.random() * 2000) + 1000,
      createdAt: new Date().toISOString(),
      driver: { name: nearest.name, rating: 4.5 },
    };

    setCurrentTrip(trip);
    router.replace(`/rider/trip?id=${trip.id}`);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView 
        style={{ flex: 1 }} 
        initialRegion={region}
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {pickup && (
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
        )}

        {nearest && (
          <Marker
            coordinate={{ latitude: nearest.lat, longitude: nearest.lon }}
            title={nearest.name}
          />
        )}

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={COLORS.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      <View style={styles.card}>
        <Text style={styles.title}>Driver Matching</Text>

        {eta && (
          <Text style={styles.eta}>ETA to driver: {eta}</Text>
        )}

        <View style={styles.row}>
          <TouchableOpacity style={styles.btnOutline} onPress={findNearestDriver}>
            <Text>Find Nearest</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary} onPress={confirmBooking}>
            <Text style={{ color: '#fff' }}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {nearest && (
          <Text style={styles.driverName}>Selected: {nearest.name}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { position: 'absolute', bottom: 10, left: 12, right: 12, padding: SPACING.lg, backgroundColor: '#fff', borderRadius: 16 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  eta: { color: COLORS.textSecondary, marginTop: 6 },
  row: { flexDirection: 'row', gap: 10, marginTop: SPACING.md },
  driverName: { marginTop: 10, fontWeight: FONT_WEIGHT.semibold },
  btnPrimary: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.primary, borderRadius: 10, alignItems: 'center' },
  btnOutline: { flex: 1, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, alignItems: 'center' },
});
