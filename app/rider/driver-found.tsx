// ========================================
// app/rider/driver-found.tsx - Driver Profile
// ========================================
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';

const MOCK_DRIVER = {
  id: '1',
  name: 'John Adekunle',
  rating: 4.8,
  totalTrips: 1234,
  vehicleModel: 'Toyota Camry 2021',
  vehicleColor: 'Black',
  plateNumber: 'ABC 123 XY',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  eta: '3 min',
  location: { latitude: 9.0765, longitude: 7.4000 },
};

export default function DriverFoundScreen() {
  useEffect(() => {
    // Auto-navigate after 3 seconds
    const timeout = setTimeout(() => {
      router.push('/rider/trip');
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 9.0765,
          longitude: 7.3986,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={darkMapStyle}
      >
        <Marker coordinate={MOCK_DRIVER.location} />
      </MapView>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.successBanner}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successText}>Driver Found!</Text>
        </View>

        <View style={styles.driverInfo}>
          <Image
            source={{ uri: MOCK_DRIVER.profileImage }}
            style={styles.driverImage}
          />
          
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{MOCK_DRIVER.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStars}>⭐ {MOCK_DRIVER.rating}</Text>
              <Text style={styles.ratingTrips}>• {MOCK_DRIVER.totalTrips} trips</Text>
            </View>
            <Text style={styles.vehicleInfo}>
              {MOCK_DRIVER.vehicleModel} • {MOCK_DRIVER.vehicleColor}
            </Text>
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

        {/* Actions */}
        <View style={styles.actions}>
          <ActionButton icon="💬" label="Message" onPress={() => {}} />
          <ActionButton icon="📞" label="Call" onPress={() => {}} />
          <ActionButton icon="👤" label="Profile" onPress={() => router.push('/rider/driver-profile')} />
        </View>

        <Button
          title="Cancel Ride"
          variant="outline"
          fullWidth
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

function ActionButton({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
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
    flex: 1,
  },
  driverCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.lg,
    ...SHADOW.xl,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success + '20',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  successIcon: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.success,
  },
  successText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.success,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  driverImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.gray200,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingStars: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  ratingTrips: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  vehicleInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  etaBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  etaText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  etaLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  plateContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  plateNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  actionIcon: {
    fontSize: FONT_SIZE.xxl,
    marginBottom: SPACING.xs,
  },
  actionLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
});
