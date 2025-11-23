import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, sizes } from '../../constants';
import { formatCurrency, formatTime } from '../../utils/formatter';

interface Driver {
  name: string;
  rating: number;
  photo?: string;
}

interface RideCardProps {
  routeName: string;
  driver: Driver;
  departureTime: string;
  seatsAvailable: number;
  price: number;
  matchReason?: string;
  onPress?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  routeName,
  driver,
  departureTime,
  seatsAvailable,
  price,
  matchReason,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.routeName}>{routeName}</Text>
          <Text style={styles.driverName}>{driver.name}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>★ {driver.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Departure</Text>
          <Text style={styles.detailValue}>{formatTime(departureTime)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Seats</Text>
          <Text style={styles.detailValue}>{seatsAvailable} available</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Price</Text>
          <Text style={styles.priceValue}>{formatCurrency(price)}</Text>
        </View>
      </View>

      {matchReason && (
        <View style={styles.matchReasonContainer}>
          <Text style={styles.matchReason}>{matchReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusLg,
    padding: sizes.md,
    marginHorizontal: sizes.md,
    marginVertical: sizes.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: sizes.sm,
  },
  routeName: {
    fontSize: sizes.fontLg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  driverName: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
  },
  ratingContainer: {
    backgroundColor: colors.light,
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusSm,
  },
  rating: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.warning,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: sizes.sm,
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
    fontWeight: '500',
  },
  priceValue: {
    fontSize: sizes.fontMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  matchReasonContainer: {
    marginTop: sizes.sm,
    paddingTop: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  matchReason: {
    fontSize: sizes.fontSm,
    color: colors.success,
    fontStyle: 'italic',
  },
});
