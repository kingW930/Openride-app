// app/onboarding/welcome.tsx
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/onboarding/carousel');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="navigate-circle" size={width * 0.2} color={COLORS.primary} />
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.appNameOpen}>Open</Text>
            <Text style={styles.appNameRide}>Ride</Text>
          </View>

          <Text style={styles.tagline}>
            Seamless commuting, redefined.
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  appNameOpen: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  appNameRide: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.black,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  bottomSection: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
