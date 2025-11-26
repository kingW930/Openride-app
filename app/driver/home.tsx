// app/driver/home.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { useDriverStore } from '@/store/driverStore';
import { RideMap } from '@/components/map/RideMap';
import { useLocation } from '@/hooks/useLocation';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SHADOW,
} from '@/constants';

export default function DriverHome() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOnline, setOnlineStatus, pendingRequests } = useDriverStore();

  // Use your hook to get location updates (starts when isOnline true)
  const { location } = useLocation(isOnline);

  // Map-friendly userLocation
  const userLocation = location
    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
    : null;

  useEffect(() => {
    // If there are incoming requests, optionally navigate to requests screen
    // (keeps UX simple: driver can tap a request in the list too)
  }, [pendingRequests]);

  function handleToggleOnline(v: boolean) {
    setOnlineStatus(v);
    if (v) {
      // bring driver to dashboard (can be used to start background tracking)
    } else {
      // optionally show confirmation
    }
  }

  function handleRequestPress(req: any) {
    // navigate to a dedicated request screen or open modal
    router.push(`/driver/request?id=${req.id}`);
  }

  function handleCreateRoute() {
    router.push('/driver/create-route');
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <RideMap userLocation={userLocation} showDrivers />
      </View>

      {/* Floating header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'Driver'}
            </Text>
            <Text style={styles.subtitle}>
              {isOnline ? 'You are online' : 'You are offline'}
            </Text>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Online</Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>
      </View>

      {/* Dashboard / bottom sheet */}
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <Text style={styles.dashboardSubtitle}>Overview</Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/driver/trips')}
            accessibilityLabel="Open Trips"
          >
            <Icon name="chevron-right" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{/* compute real stats here */}0</Text>
            <Text style={styles.statLabel}>Today's Trips</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>₦{/* compute earnings */}0</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Pending Requests ({pendingRequests.length})
          </Text>

          {pendingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isOnline
                  ? 'Waiting for ride requests...'
                  : 'Go online to receive ride requests'}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.requestsList} contentContainerStyle={{ paddingBottom: 8 }}>
              {pendingRequests.map((request: any) => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.requestCard}
                  onPress={() => handleRequestPress(request)}
                >
                  <View style={styles.requestLeft}>
                    <Icon name="map-pin" size={18} color={COLORS.primary} />
                  </View>

                  <View style={styles.requestBody}>
                    <Text style={styles.requestTitle}>{request.pickup || 'Unknown pickup'}</Text>
                    <Text style={styles.requestMeta}>{request.distance ? `${request.distance} km` : ''} · {request.eta || ''}</Text>
                  </View>

                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() => {
                        // quick accept flow - you may replace with a proper accept handler
                        try {
                          useDriverStore.getState().setIncomingRequest(request);
                          useDriverStore.getState().acceptRequest();
                          router.push('/driver/trip');
                        } catch (err) {
                          Alert.alert('Error', 'Unable to accept request');
                        }
                      }}
                    >
                      <Text style={styles.acceptText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity style={styles.createRouteButton} onPress={handleCreateRoute}>
          <Text style={styles.createRouteText}>+ Create New Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  mapContainer: {
    flex: 1,
  },

  header: {
    position: 'absolute',
    top: SPACING.xl,
    left: SPACING.md,
    right: SPACING.md,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOW.md,
  },

  greetingWrap: {
    flex: 1,
  },

  greeting: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  toggleContainer: {
    alignItems: 'center',
    marginLeft: SPACING.md,
  },

  toggleLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  dashboardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl || 24,
    borderTopRightRadius: RADIUS.xl || 24,
    padding: SPACING.lg,
    maxHeight: '48%',
    ...SHADOW.md,
  },

  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  dashboardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  dashboardSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  section: {
    marginBottom: SPACING.md,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },

  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  requestsList: {
    maxHeight: 160,
  },

  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  requestLeft: {
    width: 40,
    alignItems: 'center',
  },

  requestBody: {
    flex: 1,
    paddingLeft: SPACING.sm,
  },

  requestTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },

  requestMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  requestActions: {
    marginLeft: SPACING.sm,
  },

  acceptBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  acceptText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
  },

  createRouteButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },

  createRouteText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
