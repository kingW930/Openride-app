import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

interface RoleCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  delay: number;
}

const RoleCard: React.FC<RoleCardProps> = ({ iconName, title, description, onPress, delay }) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
    <TouchableOpacity style={styles.roleCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={32} color={COLORS.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.gray200} />
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
    <SafeAreaView style={styles.container}>
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
            iconName="person-outline"
            title="I am a Rider"
            description="Book rides and get to your destination safely"
            onPress={() => handleRoleSelection('rider')}
            delay={200}
          />
          <RoleCard
            iconName="car-sport-outline"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  rolesContainer: {
    gap: SPACING.md,
  },
  roleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
});
