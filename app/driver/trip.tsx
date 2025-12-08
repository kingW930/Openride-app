import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OpenStreetMap } from '@/components/map/OpenStreetMap';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';
import { useDriverStore } from '@/store/driverStore';
import { getRoute } from '@/utils/getRoute';
import * as Location from 'expo-location';

const { height } = Dimensions.get('window');

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
          if (activeTrip?.pickup) {
            const { coords } = await getRoute(
              loc.coords,
              { latitude: activeTrip.pickup.latitude, longitude: activeTrip.pickup.longitude }
            );
            setCoords(coords);
          }
        }
      );
    }
    track();
    return () => sub?.remove();
  }, [activeTrip]);

  if (!activeTrip) return null;

  const mapMarkers = [
    ...(driverLocation ? [{
      id: 'driver',
      latitude: driverLocation.latitude,
      longitude: driverLocation.longitude,
      title: 'You',
      type: 'driver' as const,
    }] : []),
    {
      id: 'pickup',
      latitude: activeTrip.pickup.latitude,
      longitude: activeTrip.pickup.longitude,
      title: 'Pickup',
      type: 'pickup' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={driverLocation?.latitude || activeTrip.pickup.latitude}
          longitude={driverLocation?.longitude || activeTrip.pickup.longitude}
          zoom={14}
          markers={mapMarkers}
          showUserLocation={false}
          route={coords}
          routeColor={COLORS.primary}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="navigate-circle" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Active Trip</Text>
        </View>
        
        <View style={styles.riderInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{activeTrip.riderName?.charAt(0) || 'R'}</Text>
          </View>
          <View style={styles.riderDetails}>
            <Text style={styles.riderName}>{activeTrip.riderName || 'Rider'}</Text>
            <Text style={styles.pickupAddress}>Pickup: {activeTrip.pickup.address}</Text>
          </View>
        </View>

        <Pressable style={styles.btn} onPress={() => completeTrip()}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
          <Text style={styles.btnText}>Complete Trip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  card: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -20,
    ...SHADOW.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pickupAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.lg,
  },
  btnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
