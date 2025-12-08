//========================================
// app/rider/trip.tsx - Active Trip
// ========================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OpenStreetMap } from '@/components/map/OpenStreetMap';
import { useRiderStore } from '@/store/riderStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';
import { getRoute } from '@/utils/getRoute';

const { height } = Dimensions.get('window');

export default function TripScreen() {
  const { currentTrip, pickup, destination } = useRiderStore();
  const [tripStatus, setTripStatus] = useState<'arriving' | 'in-progress' | 'near-destination'>('arriving');
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number; longitude: number}[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);

  // Get locations from store or use defaults
  const pickupLat = typeof pickup === 'object' && pickup?.latitude ? pickup.latitude : 6.5244;
  const pickupLng = typeof pickup === 'object' && pickup?.longitude ? pickup.longitude : 3.3792;
  const destLat = typeof destination === 'object' && destination?.latitude ? destination.latitude : 6.4281;
  const destLng = typeof destination === 'object' && destination?.longitude ? destination.longitude : 3.4219;

  // Load road-following route using OSRM
  useEffect(() => {
    setIsLoadingRoute(true);
    getRoute(
      { latitude: pickupLat, longitude: pickupLng },
      { latitude: destLat, longitude: destLng }
    )
      .then((result) => {
        if (result.coords.length > 0) {
          setRouteCoordinates(result.coords);
        } else {
          // Fallback to straight line if OSRM fails
          setRouteCoordinates([
            { latitude: pickupLat, longitude: pickupLng },
            { latitude: destLat, longitude: destLng },
          ]);
        }
      })
      .catch(() => {
        // Fallback to straight line
        setRouteCoordinates([
          { latitude: pickupLat, longitude: pickupLng },
          { latitude: destLat, longitude: destLng },
        ]);
      })
      .finally(() => {
        setIsLoadingRoute(false);
      });
  }, [pickupLat, pickupLng, destLat, destLng]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    // Simulate trip progression
    const statusTimer = setTimeout(() => {
      if (tripStatus === 'arriving') {
        setTripStatus('in-progress');
        setTimeRemaining(12);
      } else if (tripStatus === 'in-progress') {
        setTripStatus('near-destination');
        setTimeRemaining(3);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
    };
  }, [tripStatus]);

  const handleCompleteTrip = () => {
    router.push('/rider/trip-complete');
  };

  const getStatusConfig = () => {
    switch (tripStatus) {
      case 'arriving':
        return {
          text: 'Driver is arriving',
          color: COLORS.warning,
          progress: 30,
        };
      case 'in-progress':
        return {
          text: 'Trip in progress',
          color: COLORS.success,
          progress: 60,
        };
      case 'near-destination':
        return {
          text: 'Approaching destination',
          color: COLORS.primary,
          progress: 90,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const mapMarkers = [
    {
      id: 'pickup',
      latitude: pickupLat,
      longitude: pickupLng,
      title: 'Pickup',
      type: 'pickup' as const,
    },
    {
      id: 'destination',
      latitude: destLat,
      longitude: destLng,
      title: 'Destination',
      type: 'destination' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={(pickupLat + destLat) / 2}
          longitude={(pickupLng + destLng) / 2}
          zoom={12}
          markers={mapMarkers}
          showUserLocation={false}
          route={routeCoordinates}
          routeColor={COLORS.primary}
          style={{ flex: 1 }}
        />
        {isLoadingRoute && (
          <View style={styles.routeLoadingOverlay}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        )}
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        {/* Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
            <Text style={styles.statusText}>{statusConfig.text}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeRemaining}>{timeRemaining}</Text>
            <Text style={styles.timeLabel}>min</Text>
          </View>
        </View>

        {/* Trip Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${statusConfig.progress}%` }]} />
        </View>

        {/* Driver Info Summary */}
        {currentTrip?.driver && (
          <View style={styles.driverSummary}>
            <View style={styles.driverAvatar}>
              <Text style={styles.avatarText}>{currentTrip.driver.name.charAt(0)}</Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{currentTrip.driver.name}</Text>
              <Text style={styles.vehicleInfo}>{currentTrip.driver.vehicle}</Text>
            </View>
            <View style={styles.fareContainer}>
              <Text style={styles.fareLabel}>Fare</Text>
              <Text style={styles.fareAmount}>₦{currentTrip.fare?.toLocaleString()}</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="call-outline" size={22} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.textPrimary} />
            <Text style={styles.quickActionText}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleCompleteTrip}>
            <Ionicons name="ticket-outline" size={22} color={COLORS.primary} />
            <Text style={[styles.quickActionText, { color: COLORS.primary }]}>Ticket</Text>
          </TouchableOpacity>
        </View>
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
  routeLoadingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    ...SHADOW.md,
  },
  statusCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -24,
    padding: SPACING.lg,
    ...SHADOW.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  timeRemaining: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timeLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },
  driverSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  driverAvatar: {
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
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  vehicleInfo: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fareContainer: {
    alignItems: 'flex-end',
  },
  fareLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fareAmount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  quickAction: {
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    flex: 1,
    gap: 4,
  },
  quickActionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
