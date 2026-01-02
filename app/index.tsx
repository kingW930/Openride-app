// app/index.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { isPassenger, isCaptain, requiresVerification } from '@/types/user';

export default function Index() {
  const { user, isLoading } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Give the app a moment to initialize
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !ready) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // Redirect based on auth state
  if (user) {
    // Check if user needs verification first
    if (requiresVerification(user.kycStatus)) {
      return <Redirect href="/verification" />;
    }

    // User is logged in and verified, redirect to appropriate home based on role
    if (isCaptain(user.role)) {
      return <Redirect href="/driver/home" />;
    }
    // Default: Passenger goes to rider screens
    return <Redirect href="/rider/home" />;
  }

  // Not logged in, show onboarding
  return <Redirect href="/onboarding/welcome" />;
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
});
