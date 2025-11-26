import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, GRADIENTS, SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleRegister = () => {
    // Test mode - no validation
    login({
      id: `test-user-${Date.now()}`,
      name: name || 'Test User',
      email: email || 'test@openride.com',
      phone: phone || '+234XXXXXXXXXX',
      role: 'rider',
      kycStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    router.replace('/onboarding/role-selection');
  };

  return (
    <LinearGradient
      colors={GRADIENTS.primary as any}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(600)}>
            <View style={styles.header}>
              <Text style={styles.emoji}>🚗</Text>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join OpenRide today</Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.form}
          >
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              icon="👤"
            />

            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="📧"
            />

            <Input
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              icon="📱"
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
            />

            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>
                Already have an account? <Text style={styles.linkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  emoji: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.9,
  },
  form: {
    gap: SPACING.lg,
  },
  linkContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  linkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  linkBold: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
