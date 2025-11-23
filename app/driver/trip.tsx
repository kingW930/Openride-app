import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RideMap } from '../../src/components/map/RideMap';
import { TripStatusCard } from '../../src/components/ride/TripStatusCard';
import { useLocation } from '../../src/hooks/useLocation';
import { colors, sizes } from '../../src/constants';

export default function DriverTrip() {
  const { location } = useLocation(true);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const userLocation = location
    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
    : null;

  const riders = [
    { id: '1', name: 'John Doe', status: 'pending', stop: 'Ikeja' },
    { id: '2', name: 'Jane Smith', status: 'checked-in', stop: 'VI' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <RideMap userLocation={userLocation} />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Active Trip</Text>
      </View>

      <View style={styles.tripContainer}>
        <TripStatusCard
          status="STARTED"
          driverName="You"
          eta="15 mins"
          distance="5.2 km"
        />

        <View style={styles.ridersSection}>
          <Text style={styles.sectionTitle}>Riders ({riders.length})</Text>
          <ScrollView style={styles.ridersList}>
            {riders.map((rider) => (
              <View key={rider.id} style={styles.riderCard}>
                <View style={styles.riderInfo}>
                  <Text style={styles.riderName}>{rider.name}</Text>
                  <Text style={styles.riderStop}>📍 {rider.stop}</Text>
                </View>
                {rider.status === 'pending' ? (
                  <TouchableOpacity
                    style={styles.checkInButton}
                    onPress={() => setShowQRScanner(true)}
                  >
                    <Text style={styles.checkInText}>Check In</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.checkedBadge}>
                    <Text style={styles.checkedText}>✓ Checked</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeText}>Complete Trip</Text>
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
  title: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    backgroundColor: colors.white,
    padding: sizes.md,
    borderRadius: sizes.radiusLg,
    textAlign: 'center',
  },
  tripContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: sizes.radiusXl,
    borderTopRightRadius: sizes.radiusXl,
    padding: sizes.md,
    maxHeight: '60%',
  },
  ridersSection: {
    marginTop: sizes.md,
    flex: 1,
  },
  sectionTitle: {
    fontSize: sizes.fontMd,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.sm,
  },
  ridersList: {
    flex: 1,
  },
  riderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    marginBottom: sizes.sm,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: sizes.fontMd,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  riderStop: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
  },
  checkInButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.radiusMd,
  },
  checkInText: {
    color: colors.white,
    fontSize: sizes.fontSm,
    fontWeight: '600',
  },
  checkedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.radiusMd,
  },
  checkedText: {
    color: colors.white,
    fontSize: sizes.fontSm,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: colors.success,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
    marginTop: sizes.md,
  },
  completeText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
});
