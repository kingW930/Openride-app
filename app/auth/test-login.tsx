import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView style={styles.container}>
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
            <View style={styles.iconContainer}>
              <Ionicons name="hand-left-outline" size={60} color={COLORS.primary} />
            </View>
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
                style={styles.input}
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
                style={styles.input}
              />
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
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
              style={styles.button}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    marginTop: SPACING.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
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
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray200,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
  },
});
