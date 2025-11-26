// app/onboarding/welcome.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  // Optional: automatically navigate after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => router.push('/onboarding/features'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(600)}
              style={[styles.logo, { width: width * 0.25, height: width * 0.25, borderRadius: (width * 0.25) / 2, alignItems: 'center', justifyContent: 'center' }]}
              accessibilityRole="image"
              accessible
            >
              {/* professional icon */}
              <Ionicons name="car-outline" size={Math.round(width * 0.12)} color={COLORS.white} />
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(400).duration(600)}
              style={[styles.appName, { fontSize: width * 0.1 }]}
              accessibilityRole="header"
            >
              OpenRide
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(600).duration(600)}
              style={[styles.tagline, { fontSize: width * 0.045 }]}
            >
              Affordable rides for everyone
            </Animated.Text>
          </View>

          {/* Brand Statement */}
          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.statementSection}>
            <Text style={styles.statement}>
              Your journey begins here. Connect with verified drivers and reach your destination safely.
            </Text>
          </Animated.View>

          {/* CTA Button with Pressable animation */}
          <Animated.View entering={FadeInDown.delay(1000).duration(600)} style={styles.buttonContainer}>
            <Pressable
              onPress={() => router.push('/onboarding/features')}
              style={({ pressed }) => [{ opacity: pressed ? 0.78 : 1 }]}
              accessibilityRole="button"
              accessible
              accessibilityLabel="Get Started"
            >
              <Button
                title="Get Started"
                variant="secondary"
                onPress={() => router.push('/onboarding/features')}
                fullWidth
                size="lg"
              />
            </Pressable>
          </Animated.View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primary, // circular badge behind icon
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  appName: {
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.white,
    opacity: 0.95,
    textAlign: 'center',
  },
  statementSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  statement: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.85,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
});
