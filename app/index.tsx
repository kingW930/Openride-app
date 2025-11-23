import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAuthStore } from '../src/store/authStore';
import { GRADIENTS, FONT_SIZE, FONT_WEIGHT, COLORS } from '@/constants';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (!user) {
          router.replace('/onboarding/welcome');
        } else if (user.role === 'rider') {
          router.replace('/rider/home');
        } else if (user.role === 'driver') {
          router.replace('/driver/home');
        } else {
          router.replace('/onboarding/role-selection');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, isLoading]);

  return (
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(400)}
        style={styles.content}
      >
        <Text style={styles.logo}>🚗</Text>
        <Text style={styles.appName}>OpenRide</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
});
