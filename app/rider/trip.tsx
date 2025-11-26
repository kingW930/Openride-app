//========================================
// app/rider/trip.tsx - Active Trip
// ========================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { router } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';

export default function TripScreen() {
  const [tripStatus, setTripStatus] = useState<'arriving' | 'in-progress' | 'near-destination'>('arriving');
  const [timeRemaining, setTimeRemaining] = useState(15);

  useEffect(() => {
    // Simulate trip progression
    const statusTimer = setTimeout(() => {
      if (tripStatus === 'arriving') {
        setTripStatus('in-progress');
      } else if (tripStatus === 'in-progress') {
        setTripStatus('near-destination');
      }
    }, 5000);

    return () => clearTimeout(statusTimer);
  }, [tripStatus]);

  const handleCompleteTrip = () => {
    router.push('/rider/trip-complete');
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 9.0765,
          longitude: 7.3986,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        loadingEnabled={true}
        loadingIndicatorColor={COLORS.primary}
      />

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, tripStatus === 'in-progress' && styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {tripStatus === 'arriving' && 'Driver is arriving'}
              {tripStatus === 'in-progress' && 'Trip in progress'}
              {tripStatus === 'near-destination' && 'Approaching destination'}
            </Text>
          </View>
          <Text style={styles.timeRemaining}>{timeRemaining} min</Text>
        </View>

        {/* Trip Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: tripStatus === 'arriving' ? '30%' : tripStatus === 'in-progress' ? '60%' : '90%' }]} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>💬</Text>
            <Text style={styles.quickActionText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>🛡️</Text>
            <Text style={styles.quickActionText}>Safety</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={handleCompleteTrip}>
            <Text style={styles.quickActionIcon}>🎫</Text>
            <Text style={styles.quickActionText}>Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  statusCard: {
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
    backgroundColor: COLORS.warning,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  timeRemaining: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
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
  },
  quickActionIcon: {
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHT.medium,
  },
});
