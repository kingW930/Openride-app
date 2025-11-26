import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

interface RoleCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  delay: number;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
    <TouchableOpacity style={styles.roleCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Text style={styles.roleIcon}>{icon}</Text>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

export default function RoleSelectionScreen() {
  const router = useRouter();
  const updateUser = useAuthStore((state) => state.updateUser);

  const handleRoleSelection = (role: 'rider' | 'driver') => {
    updateUser({ role });
    
    if (role === 'rider') {
      router.replace('/rider/home');
    } else {
      router.replace('/driver/home');
    }
  };

  return (
    <LinearGradient colors={GRADIENTS.primary as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.header}
          >
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>
              How would you like to use OpenRide?
            </Text>
          </Animated.View>

          {/* Role Cards */}
          <View style={styles.rolesContainer}>
            <RoleCard
              icon="🙋"
              title="I am a Rider"
              description="Book rides and get to your destination safely"
              onPress={() => handleRoleSelection('rider')}
              delay={200}
            />
            <RoleCard
              icon="🚗"
              title="I am a Driver"
              description="Earn money by giving rides to passengers"
              onPress={() => handleRoleSelection('driver')}
              delay={400}
            />
          </View>

          {/* Footer Note */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(600)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              You can switch roles anytime in settings
            </Text>
          </Animated.View>
        </View>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.85,
    textAlign: 'center',
  },
  rolesContainer: {
    gap: SPACING.lg,
  },
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: SPACING.xl,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    alignItems: 'center',
  },
  roleIcon: {
    fontSize: 80,
    marginBottom: SPACING.md,
  },
  roleTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
  },
});
