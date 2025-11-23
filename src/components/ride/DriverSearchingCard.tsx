import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, sizes } from '../../constants';

interface DriverSearchingCardProps {
  searchRadius?: string;
  estimatedWaitTime?: string;
}

export const DriverSearchingCard: React.FC<DriverSearchingCardProps> = ({
  searchRadius = '2 km',
  estimatedWaitTime = '2-5 min',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.title}>Finding drivers nearby...</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Search radius:</Text>
          <Text style={styles.infoValue}>{searchRadius}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estimated wait:</Text>
          <Text style={styles.infoValue}>{estimatedWaitTime}</Text>
        </View>
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipTitle}>💡 Tip</Text>
        <Text style={styles.tipText}>
          Drivers on your route are being notified. You'll be matched with the best option shortly.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusLg,
    padding: sizes.lg,
    margin: sizes.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  title: {
    fontSize: sizes.fontLg,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: sizes.md,
  },
  info: {
    backgroundColor: colors.light,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    marginBottom: sizes.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.xs,
  },
  infoLabel: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: sizes.fontSm,
    color: colors.text,
    fontWeight: '600',
  },
  tips: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: sizes.md,
  },
  tipTitle: {
    fontSize: sizes.fontMd,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  tipText: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
