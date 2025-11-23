import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    // No validation - just login and go to role selection
    login({
      id: 'user-' + Date.now(),
      name: 'Test User',
      email: '',
      phone: phone || '+234 XXX XXX XXXX',
      role: undefined,
    });
    
    router.replace('/onboarding/role-selection');
  };

  return (
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
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
            <Animated.View 
              entering={FadeInDown.duration(600)}
              style={styles.header}
            >
              <Text style={styles.icon}>🚗</Text>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>
                Sign in to continue
              </Text>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(200).duration(600)}
              style={styles.form}
            >
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <Input
                  placeholder="+234 XXX XXX XXXX"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Test mode: No validation required - just tap Login!
                </Text>
              </View>
            </Animated.View>

            <Animated.View 
              entering={FadeInDown.delay(400).duration(600)}
              style={styles.buttonContainer}
            >
              <Button
                title="Login"
                onPress={handleLogin}
                variant="secondary"
              />
              
              <Button
                title="Don't have an account? Register"
                onPress={() => router.push('/auth/register')}
                variant="ghost"
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
    fontSize: FONT_SIZE['3xl'],
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
    gap: SPACING.sm,
    marginTop: 'auto',
  },
});
