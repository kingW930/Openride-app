import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, sizes } from '../../constants';
import { TripStatus } from '../../types/trip';

interface TripStatusCardProps {
  status: TripStatus;
  driverName?: string;
  eta?: string;
  distance?: string;
}

const statusConfig: Record<TripStatus, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Waiting for driver', color: colors.warning, icon: '⏳' },
  ACCEPTED: { label: 'Driver accepted', color: colors.success, icon: '✓' },
  ARRIVING: { label: 'Driver is arriving', color: colors.info, icon: '🚗' },
  STARTED: { label: 'Trip in progress', color: colors.primary, icon: '🛣️' },
  COMPLETED: { label: 'Trip completed', color: colors.success, icon: '✓' },
  CANCELLED: { label: 'Trip cancelled', color: colors.danger, icon: '✕' },
};

export const TripStatusCard: React.FC<TripStatusCardProps> = ({
  status,
  driverName,
  eta,
  distance,
}) => {
  const config = statusConfig[status];

  return (
    <View style={[styles.card, { borderLeftColor: config.color }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.status, { color: config.color }]}>{config.label}</Text>
          {driverName && <Text style={styles.driverName}>{driverName}</Text>}
        </View>
      </View>

      {(eta || distance) && (
        <View style={styles.details}>
          {eta && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ETA</Text>
              <Text style={styles.detailValue}>{eta}</Text>
            </View>
          )}
          {distance && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{distance}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusLg,
    padding: sizes.md,
    marginHorizontal: sizes.md,
    marginVertical: sizes.sm,
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: sizes.sm,
  },
  headerText: {
    flex: 1,
  },
  status: {
    fontSize: sizes.fontLg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverName: {
    fontSize: sizes.fontMd,
    color: colors.textSecondary,
  },
  details: {
    flexDirection: 'row',
    marginTop: sizes.md,
    paddingTop: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: sizes.fontMd,
    color: colors.text,
    fontWeight: '600',
  },
});
