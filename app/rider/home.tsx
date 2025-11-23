// app/rider/home.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRiderStore } from '@/store/riderStore';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SHADOW } from '@/constants';

export default function RiderHomeScreen() {
  const { user } = useAuthStore();
  const { tripHistory } = useRiderStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingTrips = tripHistory.filter(
    trip => trip.status === 'pending' || trip.status === 'accepted'
  );
  const pastTrips = tripHistory.filter(
    trip => trip.status === 'completed' || trip.status === 'cancelled'
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>OpenRide - Nigerian Rideshare</Text>
          <Text style={styles.headerSubtitle}>openride.vercel.app/rider</Text>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Find Your Ride</Text>
          <Text style={styles.mainSubtitle}>
            Search, book, and track your rides with AI-powered matching
          </Text>
        </View>

        {/* Search Actions */}
        <View style={styles.searchActions}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push('/rider/search')}
          >
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
            </View>
            <Text style={styles.searchButtonText}>Search Rides</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookingsButton}
            onPress={() => {}}
          >
            <View style={styles.bookingsIconContainer}>
              <Text style={styles.bookingsIcon}>📍</Text>
            </View>
            <Text style={styles.bookingsButtonText}>My Bookings</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Past Rides
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trip Cards */}
        {activeTab === 'upcoming' ? (
          upcomingTrips.length > 0 ? (
            upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <EmptyState
              icon="📅"
              title="No Upcoming Rides"
              subtitle="Book a ride to get started"
              actionText="Search Rides"
              onAction={() => router.push('/rider/search')}
            />
          )
        ) : (
          pastTrips.length > 0 ? (
            pastTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))
          ) : (
            <EmptyState
              icon="🚗"
              title="No Past Rides"
              subtitle="Your completed rides will appear here"
            />
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface TripCardProps {
  trip: any;
}

function TripCard({ trip }: TripCardProps) {
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: COLORS.statusPendingBg, text: COLORS.statusPendingText, label: 'Pending' },
      accepted: { bg: COLORS.statusConfirmedBg, text: COLORS.statusConfirmedText, label: 'Confirmed' },
      completed: { bg: COLORS.statusCompletedBg, text: COLORS.statusCompletedText, label: 'Completed' },
      cancelled: { bg: COLORS.statusCancelledBg, text: COLORS.statusCancelledText, label: 'Cancelled' },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const badge = getStatusBadge(trip.status);

  return (
    <View style={styles.tripCard}>
      {/* Status Badge */}
      <View style={styles.tripHeader}>
        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: badge.text }]} />
          <Text style={[styles.statusText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
        <Text style={styles.tripId}>#{trip.id.slice(0, 6).toUpperCase()}</Text>
      </View>

      {/* Locations */}
      <View style={styles.tripLocations}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {trip.pickup.address || 'Pickup location'}
            </Text>
          </View>
        </View>

        <View style={styles.locationConnector} />

        <View style={styles.locationRow}>
          <View style={[styles.locationDot, styles.destinationDot]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {trip.destination.address || 'Destination'}
            </Text>
          </View>
        </View>
      </View>

      {/* Date & Time */}
      <View style={styles.tripDateTime}>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeIcon}>📅</Text>
          <Text style={styles.dateTimeText}>
            {new Date(trip.createdAt).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <Text style={styles.dateTimeSeparator}>•</Text>
        <View style={styles.dateTimeItem}>
          <Text style={styles.dateTimeIcon}>⏰</Text>
          <Text style={styles.dateTimeText}>
            {new Date(trip.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      </View>

      {/* Driver Info (if assigned) */}
      {trip.driver && (
        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>
                {trip.driver.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>{trip.driver.name}</Text>
              <View style={styles.driverMeta}>
                <Text style={styles.driverRating}>⭐ {trip.driver.rating}</Text>
                <Text style={styles.driverMetaSeparator}>•</Text>
                <Text style={styles.driverVehicle}>{trip.driver.vehicleType}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vehicle & Fare */}
      <View style={styles.tripFooter}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleLabel}>Vehicle</Text>
          <Text style={styles.vehicleValue}>{trip.driver?.vehicleNumber || 'ABC 123 XY'}</Text>
          <Text style={styles.vehicleSeats}>1 seat(s)</Text>
        </View>

        <View style={styles.fareInfo}>
          <Text style={styles.fareLabel}>Total Fare</Text>
          <Text style={styles.fareValue}>₦{trip.fare}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.tripActions}>
        <TouchableOpacity
          style={styles.actionButtonOutline}
          onPress={() => router.push(`/rider/trip-details?id=${trip.id}`)}
        >
          <Text style={styles.actionButtonIcon}>🎫</Text>
          <Text style={styles.actionButtonOutlineText}>View Ticket</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonPrimary}
          onPress={() => router.push(`/rider/trip?id=${trip.id}`)}
        >
          <Text style={styles.actionButtonIcon}>📍</Text>
          <Text style={styles.actionButtonPrimaryText}>Track Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyState({ icon, title, subtitle, actionText, onAction }: any) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {actionText && (
        <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
          <Text style={styles.emptyActionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  titleSection: {
    marginBottom: SPACING.xl,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  mainSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  searchActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  searchButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 20,
  },
  searchButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  bookingsButton: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingsIcon: {
    fontSize: 20,
  },
  bookingsButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tripCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tripId: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  tripLocations: {
    marginBottom: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  destinationDot: {
    backgroundColor: COLORS.error,
  },
  locationConnector: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },
  tripDateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.sm,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTimeIcon: {
    fontSize: 14,
  },
  dateTimeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  dateTimeSeparator: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textTertiary,
  },
  driverSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverAvatarText: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverRating: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  driverMetaSeparator: {
    marginHorizontal: 6,
    color: COLORS.textTertiary,
  },
  driverVehicle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: {
    fontSize: 20,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  vehicleInfo: {},
  vehicleLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  vehicleValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  vehicleSeats: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fareInfo: {
    alignItems: 'flex-end',
  },
  fareLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  fareValue: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  tripActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionButtonIcon: {
    fontSize: 16,
  },
  actionButtonOutlineText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  actionButtonPrimaryText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyAction: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  emptyActionText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },
});