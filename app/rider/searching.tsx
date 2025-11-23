// ========================================
// app/rider/searching.tsx - Finding Driver
// ========================================
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';

export default function SearchingScreen() {
  const [dots, setDots] = useState('');
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animated dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate finding driver
    const timeout = setTimeout(() => {
      router.replace('/rider/driver-found');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.searchIcon}>🔍</Text>
      </Animated.View>

      <Text style={styles.title}>Finding your driver{dots}</Text>
      <Text style={styles.subtitle}>
        We're matching you with the nearest available driver
      </Text>

      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />

      <View style={styles.statsContainer}>
        <StatItem label="Drivers nearby" value="12" />
        <StatItem label="Avg. wait time" value="3 min" />
      </View>

      <Button
        title="Cancel Request"
        onPress={() => router.back()}
        variant="outline"
        fullWidth
      />
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  searchIcon: {
    fontSize: 60,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loader: {
    marginBottom: SPACING.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});
