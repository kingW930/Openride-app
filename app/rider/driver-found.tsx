// ========================================
// app/rider/driver-found.tsx - Driver Profile Screen
// ========================================
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OpenStreetMap } from '@/components/map/OpenStreetMap';
import { useRiderStore } from '@/store/riderStore';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '@/constants';
import { getRoute } from '@/utils/getRoute';

const { height } = Dimensions.get('window');

const MOCK_DRIVER = {
  id: '1',
  name: 'John Adekunle',
  rating: 4.8,
  totalTrips: 1234,
  vehicleModel: 'Toyota Camry 2021',
  vehicleColor: 'Black',
  plateNumber: 'ABC 123 XY',
  eta: '3 min',
  location: { latitude: 6.5274, longitude: 3.3812 },
};

export default function DriverFoundScreen() {
  const { currentTrip, pickup, destination } = useRiderStore();
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number; longitude: number}[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);
  
  // Get driver info from current trip or use mock
  const driverName = currentTrip?.driver?.name || MOCK_DRIVER.name;
  const driverRating = currentTrip?.driver?.rating || MOCK_DRIVER.rating;
  const driverVehicle = currentTrip?.driver?.vehicle || MOCK_DRIVER.vehicleModel;

  // Pickup location (meeting point was already selected in home.tsx)
  const pickupLat = typeof pickup === 'object' && pickup?.latitude ? pickup.latitude : 6.5244;
  const pickupLng = typeof pickup === 'object' && pickup?.longitude ? pickup.longitude : 3.3792;
  const pickupAddress = typeof pickup === 'object' && pickup?.address ? pickup.address : 'Pickup Point';

  // Load route from driver to pickup point using OSRM
  useEffect(() => {
    setIsLoadingRoute(true);
    getRoute(
      { latitude: MOCK_DRIVER.location.latitude, longitude: MOCK_DRIVER.location.longitude },
      { latitude: pickupLat, longitude: pickupLng }
    )
      .then((result) => {
        if (result.coords.length > 0) {
          setRouteCoordinates(result.coords);
        } else {
          // Fallback to straight line if OSRM fails
          setRouteCoordinates([
            { latitude: MOCK_DRIVER.location.latitude, longitude: MOCK_DRIVER.location.longitude },
            { latitude: pickupLat, longitude: pickupLng },
          ]);
        }
      })
      .catch(() => {
        // Fallback to straight line
        setRouteCoordinates([
          { latitude: MOCK_DRIVER.location.latitude, longitude: MOCK_DRIVER.location.longitude },
          { latitude: pickupLat, longitude: pickupLng },
        ]);
      })
      .finally(() => {
        setIsLoadingRoute(false);
      });
  }, [pickupLat, pickupLng]);

  const handleStartTrip = () => {
    router.push('/rider/trip');
  };

  const mapMarkers = [
    {
      id: 'driver',
      latitude: MOCK_DRIVER.location.latitude,
      longitude: MOCK_DRIVER.location.longitude,
      title: driverName,
      type: 'driver' as const,
    },
    {
      id: 'pickup',
      latitude: pickupLat,
      longitude: pickupLng,
      title: pickupAddress,
      type: 'pickup' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={(MOCK_DRIVER.location.latitude + pickupLat) / 2}
          longitude={(MOCK_DRIVER.location.longitude + pickupLng) / 2}
          zoom={14}
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

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark" size={20} color={COLORS.white} />
          </View>
          <Text style={styles.successText}>Driver Found!</Text>
        </View>

        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Text style={styles.avatarText}>{driverName.charAt(0)}</Text>
          </View>
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driverName}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{driverRating}</Text>
              <Text style={styles.ratingTrips}>• {MOCK_DRIVER.totalTrips} trips</Text>
            </View>
            <Text style={styles.vehicleInfo}>{driverVehicle}</Text>
          </View>

          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>{MOCK_DRIVER.eta}</Text>
            <Text style={styles.etaLabel}>away</Text>
          </View>
        </View>

        {/* Vehicle Plate */}
        <View style={styles.plateContainer}>
          <Text style={styles.plateNumber}>{MOCK_DRIVER.plateNumber}</Text>
        </View>

        {/* Pickup Point Display */}
        <View style={styles.pickupPointContainer}>
          <View style={styles.pickupPointInfo}>
            <Ionicons name="location" size={24} color={COLORS.success} />
            <View style={styles.pickupPointText}>
              <Text style={styles.pickupPointLabel}>Meeting Point</Text>
              <Text style={styles.pickupPointName}>{pickupAddress}</Text>
            </View>
          </View>
          <View style={styles.walkingInfo}>
            <Ionicons name="walk" size={16} color={COLORS.textSecondary} />
            <Text style={styles.walkingText}>Walk to this location</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageBtn}>
            <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
            <Text style={styles.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleStartTrip}>
          <Text style={styles.confirmBtnText}>I'm at the Pickup Point</Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancel Ride</Text>
        </TouchableOpacity>
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
    height: height * 0.35,
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
  driverCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    marginTop: -24,
    padding: SPACING.lg,
    ...SHADOW.lg,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success + '15',
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  successIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.success,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  ratingText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  ratingTrips: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  vehicleInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  etaBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  etaText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  etaLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  plateContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
  },
  plateNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  
  // Pickup Point Display
  pickupPointContainer: {
    backgroundColor: COLORS.success + '10',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  pickupPointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  pickupPointText: {
    flex: 1,
  },
  pickupPointLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  pickupPointName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  walkingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingLeft: 32,
  },
  walkingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  callBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  messageBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  
  // Buttons
  confirmBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  confirmBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
