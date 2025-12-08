// ========================================
// app/rider/searching.tsx - Finding Driver
// ========================================
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';

export default function SearchingScreen() {
  const [dots, setDots] = useState('');
  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Animated dots
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

    // Rotate animation for the radar effect
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Navigate to select-ride after matching
    const timeout = setTimeout(() => {
      router.replace('/rider/select-ride');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Animated Search Icon */}
        <View style={styles.searchContainer}>
          <Animated.View style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]} />
          <Animated.View style={[styles.middleRing, { transform: [{ rotate: spin }] }]} />
          <View style={styles.iconContainer}>
            <Ionicons name="car-sport" size={48} color={COLORS.primary} />
          </View>
        </View>

        <Text style={styles.title}>Finding your driver{dots}</Text>
        <Text style={styles.subtitle}>
          Matching you with the nearest available driver
        </Text>

        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Drivers nearby</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>~3 min</Text>
            <Text style={styles.statLabel}>Avg. wait time</Text>
          </View>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  searchContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
  },
  middleRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: COLORS.primary + '50',
    borderTopColor: COLORS.primary,
    borderRightColor: 'transparent',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loader: {
    marginBottom: SPACING.xxl,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.gray200,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  cancelBtnText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
