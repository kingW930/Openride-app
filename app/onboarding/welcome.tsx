import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          entering={FadeIn.duration(800)} 
          style={styles.content}
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.logo}
            >
              🚗
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.appName}
            >
              OpenRide
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(600).duration(600)}
              style={styles.tagline}
            >
              Affordable rides for everyone
            </Animated.Text>
          </View>

          {/* Brand Statement */}
          <Animated.View 
            entering={FadeInDown.delay(800).duration(600)}
            style={styles.statementSection}
          >
            <Text style={styles.statement}>
              Your journey begins here. Connect with verified drivers and reach your destination safely.
            </Text>
          </Animated.View>

          {/* CTA Button */}
          <Animated.View 
            entering={FadeInDown.delay(1000).duration(600)}
            style={styles.buttonContainer}
          >
            <Button
              title="Get Started"
              onPress={() => router.push('/onboarding/features')}
              variant="secondary"
            />
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
    fontSize: 120,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.white,
    opacity: 0.9,
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
  },
});
