import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

export default function TestLoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    // Save user to store in testing mode
    login({
      id: 'test-user-' + Date.now(),
      name: name || 'Test User',
      email: email || 'test@openride.com',
      phone: '',
      role: 'rider',
      kycStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Navigate to role selection
    router.push('/onboarding/role-selection');
  };

  return (
    <LinearGradient colors={GRADIENTS.primary as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Animated.View 
              entering={FadeInDown.duration(600)}
              style={styles.header}
            >
              <Text style={styles.icon}>👋</Text>
              <Text style={styles.title}>Welcome!</Text>
              <Text style={styles.subtitle}>
                Let's get to know you
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View 
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.form}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email (Optional)</Text>
                <Input
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  This is a test mode. No validation required - just tap Continue!
                </Text>
              </View>
            </Animated.View>

            {/* Button */}
            <Animated.View 
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.buttonContainer}
            >
              <Button
                title="Continue"
                onPress={handleContinue}
                variant="secondary"
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.85,
  },
  form: {
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});
