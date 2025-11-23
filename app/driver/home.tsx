import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useDriverStore } from '../../src/store/driverStore';
import { RideMap } from '../../src/components/map/RideMap';
import { useLocation } from '../../src/hooks/useLocation';
import { colors, sizes } from '../../src/constants';

export default function DriverHome() {
  const { user } = useAuthStore();
  const { isOnline, setOnlineStatus, pendingRequests } = useDriverStore();
  const { location } = useLocation(isOnline);

  const userLocation = location
    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
    : null;

  const handleToggleOnline = () => {
    setOnlineStatus(!isOnline);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <RideMap userLocation={userLocation} />
      </View>

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.name || 'Driver'}! 👋</Text>
            <Text style={styles.subtitle}>
              {isOnline ? '🟢 You are online' : '🔴 You are offline'}
            </Text>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Online</Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: colors.gray, true: colors.success }}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </View>

      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Today's Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₦0</Text>
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
            <ScrollView style={styles.requestsList}>
              {pendingRequests.map((request: any) => (
                <View key={request.id} style={styles.requestCard}>
                  <Text style={styles.requestText}>{request.pickup}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity style={styles.createRouteButton}>
          <Text style={styles.createRouteText}>+ Create New Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: sizes.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: sizes.md,
    borderRadius: sizes.radiusLg,
  },
  greeting: {
    fontSize: sizes.fontLg,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginBottom: sizes.xs,
  },
  dashboardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: sizes.radiusXl,
    borderTopRightRadius: sizes.radiusXl,
    padding: sizes.md,
    maxHeight: '50%',
  },
  dashboardTitle: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: sizes.md,
    marginBottom: sizes.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  statValue: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  statLabel: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: sizes.md,
  },
  sectionTitle: {
    fontSize: sizes.fontMd,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: sizes.lg,
  },
  emptyText: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  requestsList: {
    maxHeight: 100,
  },
  requestCard: {
    backgroundColor: colors.light,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    marginBottom: sizes.sm,
  },
  requestText: {
    fontSize: sizes.fontSm,
    color: colors.text,
  },
  createRouteButton: {
    backgroundColor: colors.primary,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  createRouteText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
});
