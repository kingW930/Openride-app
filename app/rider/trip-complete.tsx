
// ========================================
// app/rider/trip-complete.tsx - Trip Summary
// ========================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';

export default function TripCompleteScreen() {
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✓</Text>
        </View>

        <Text style={styles.title}>Trip Completed!</Text>
        <Text style={styles.subtitle}>Thank you for riding with Open Ride</Text>

        {/* Fare Summary */}
        <View style={styles.fareCard}>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Base fare</Text>
            <Text style={styles.fareValue}>₦500</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Distance (8.4 km)</Text>
            <Text style={styles.fareValue}>₦600</Text>
          </View>
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>Time (15 min)</Text>
            <Text style={styles.fareValue}>₦100</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.fareRow}>
            <Text style={styles.fareTotalLabel}>Total</Text>
            <Text style={styles.fareTotalValue}>₦1,200</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate your driver</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Text style={styles.star}>
                  {star <= rating ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Done"
          onPress={() => router.push('/rider/home')}
          fullWidth
          size="lg"
        />

        <Button
          title="Download Receipt"
          onPress={() => {}}
          variant="outline"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: SPACING.xl,
  },
  successEmoji: {
    fontSize: 40,
    color: COLORS.success,
  },
  title: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  fareCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
  },
  fareValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHT.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  fareTotalLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  fareTotalValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  ratingSection: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  ratingTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  star: {
    fontSize: 32,
  },
});
