// app/rider/select-ride.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';
import { useRiderStore } from '@/store/riderStore';
import { Button } from '@/components/ui/Button';

interface RideOption {
  id: string;
  type: string;
  name: string;
  capacity: string;
  eta: string;
  fare: number;
  icon: string;
  surge?: boolean;
}

const RIDE_OPTIONS: RideOption[] = [
  {
    id: '1',
    type: 'economy',
    name: 'Open Economy',
    capacity: '4 seats',
    eta: '5 min',
    fare: 1200,
    icon: '🚗',
  },
  {
    id: '2',
    type: 'comfort',
    name: 'Open Comfort',
    capacity: '4 seats',
    eta: '8 min',
    fare: 1800,
    icon: '🚙',
  },
  {
    id: '3',
    type: 'premium',
    name: 'Open Premium',
    capacity: '4 seats',
    eta: '10 min',
    fare: 3500,
    icon: '🏎️',
    surge: true,
  },
  {
    id: '4',
    type: 'xl',
    name: 'Open XL',
    capacity: '6 seats',
    eta: '12 min',
    fare: 2500,
    icon: '🚐',
  },
];

export default function SelectRideScreen() {
  const [selectedRide, setSelectedRide] = useState<RideOption>(RIDE_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { pickup, destination } = useRiderStore();

  const slideAnim = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();

    // Fit map to show both markers
    if (mapRef.current && pickup && destination) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          [pickup, destination],
          {
            edgePadding: { top: 100, right: 50, bottom: 400, left: 50 },
            animated: true,
          }
        );
      }, 500);
    }
  }, []);

  const handleConfirmRide = () => {
    setLoading(true);
    // Simulate finding a driver
    setTimeout(() => {
      router.push('/rider/searching');
    }, 1000);
  };

  // Mock route coordinates
  const routeCoordinates = pickup && destination ? [pickup, destination] : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: pickup?.latitude || 9.0765,
          longitude: pickup?.longitude || 7.3986,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        customMapStyle={darkMapStyle}
      >
        {/* Pickup Marker */}
        {pickup && (
          <Marker
            coordinate={pickup}
            title="Pickup"
            pinColor={COLORS.primary}
          />
        )}

        {/* Destination Marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor={COLORS.secondary}
          />
        )}

        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={COLORS.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Ride Options Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.handleBar} />

        {/* Trip Details */}
        <View style={styles.tripDetails}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText} numberOfLines={1}>
              {pickup?.address || 'Pickup location'}
            </Text>
          </View>
          <View style={styles.locationLine} />
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.destinationDot]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {destination?.address || 'Destination'}
            </Text>
          </View>
        </View>

        {/* Ride Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rideOptions}
        >
          {RIDE_OPTIONS.map((option) => (
            <RideOptionCard
              key={option.id}
              option={option}
              selected={selectedRide.id === option.id}
              onSelect={() => setSelectedRide(option)}
            />
          ))}
        </ScrollView>

        {/* Selected Ride Info */}
        <View style={styles.selectedRideInfo}>
          <View style={styles.rideInfoRow}>
            <Text style={styles.rideInfoLabel}>Estimated arrival</Text>
            <Text style={styles.rideInfoValue}>{selectedRide.eta}</Text>
          </View>
          <View style={styles.rideInfoRow}>
            <Text style={styles.rideInfoLabel}>Distance</Text>
            <Text style={styles.rideInfoValue}>8.4 km</Text>
          </View>
          {selectedRide.surge && (
            <View style={styles.surgeNotice}>
              <Text style={styles.surgeText}>⚡ Surge pricing active</Text>
            </View>
          )}
        </View>

        {/* Payment Method */}
        <TouchableOpacity style={styles.paymentMethod}>
          <Text style={styles.paymentIcon}>💳</Text>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Payment method</Text>
            <Text style={styles.paymentValue}>Cash</Text>
          </View>
          <Text style={styles.paymentArrow}>→</Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <Button
          title={`Request ${selectedRide.name} • ₦${selectedRide.fare}`}
          onPress={handleConfirmRide}
          loading={loading}
          fullWidth
          size="lg"
        />
      </Animated.View>
    </View>
  );
}

function RideOptionCard({ option, selected, onSelect }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.rideOptionCard,
        selected && styles.rideOptionCardSelected,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={styles.rideOptionIcon}>{option.icon}</Text>
      <View style={styles.rideOptionInfo}>
        <Text style={[styles.rideOptionName, selected && styles.textSelected]}>
          {option.name}
        </Text>
        <Text style={styles.rideOptionCapacity}>{option.capacity}</Text>
        <Text style={styles.rideOptionEta}>{option.eta} away</Text>
      </View>
      <View style={styles.rideOptionPrice}>
        <Text style={[styles.rideOptionFare, selected && styles.textSelected]}>
          ₦{option.fare}
        </Text>
        {option.surge && (
          <View style={styles.surgeBadge}>
            <Text style={styles.surgeBadgeText}>⚡</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#cccccc" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2d2d2d" }] },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  backButtonText: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.white,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    ...SHADOW.xl,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.gray600,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  tripDetails: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  destinationDot: {
    backgroundColor: COLORS.secondary,
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.border,
    marginLeft: 4,
    marginVertical: SPACING.xs,
  },
  locationText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  rideOptions: {
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  rideOptionCard: {
    width: 160,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rideOptionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  rideOptionIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  rideOptionInfo: {
    marginBottom: SPACING.sm,
  },
  rideOptionName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: 2,
  },
  rideOptionCapacity: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  rideOptionEta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rideOptionPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rideOptionFare: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  textSelected: {
    color: COLORS.primary,
  },
  surgeBadge: {
    backgroundColor: COLORS.accent + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  surgeBadgeText: {
    fontSize: FONT_SIZE.xs,
  },
  selectedRideInfo: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  rideInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  rideInfoLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  rideInfoValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },
  surgeNotice: {
    backgroundColor: COLORS.accent + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.sm,
  },
  surgeText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.accent,
    fontWeight: FONT_WEIGHT.semibold,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  paymentIcon: {
    fontSize: 24,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  paymentValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },
  paymentArrow: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textTertiary,
  },
});