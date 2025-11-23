import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, sizes } from '../../constants';

interface RideRequestCardProps {
  pickupAddress: string;
  dropoffAddress: string;
  estimatedPrice: number;
  estimatedTime: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RideRequestCard: React.FC<RideRequestCardProps> = ({
  pickupAddress,
  dropoffAddress,
  estimatedPrice,
  estimatedTime,
  onConfirm,
  onCancel,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Confirm Ride Request</Text>
      
      <View style={styles.routeContainer}>
        <View style={styles.routeItem}>
          <View style={[styles.dot, styles.pickupDot]} />
          <View style={styles.routeText}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.address} numberOfLines={2}>{pickupAddress}</Text>
          </View>
        </View>

        <View style={styles.routeLine} />

        <View style={styles.routeItem}>
          <View style={[styles.dot, styles.dropoffDot]} />
          <View style={styles.routeText}>
            <Text style={styles.label}>Dropoff</Text>
            <Text style={styles.address} numberOfLines={2}>{dropoffAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Estimated Time</Text>
          <Text style={styles.infoValue}>{estimatedTime}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Estimated Price</Text>
          <Text style={styles.priceValue}>₦{estimatedPrice}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: sizes.radiusXl,
    borderTopRightRadius: sizes.radiusXl,
    padding: sizes.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.lg,
  },
  routeContainer: {
    marginBottom: sizes.lg,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: sizes.sm,
  },
  pickupDot: {
    backgroundColor: colors.success,
  },
  dropoffDot: {
    backgroundColor: colors.danger,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  routeText: {
    flex: 1,
  },
  label: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  address: {
    fontSize: sizes.fontMd,
    color: colors.text,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: sizes.lg,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: sizes.fontLg,
    color: colors.text,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: sizes.fontLg,
    color: colors.primary,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.text,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    alignItems: 'center',
  },
  confirmText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
});
