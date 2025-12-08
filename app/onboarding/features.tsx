import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
  <Animated.View 
    entering={FadeInDown.delay(delay).duration(600)}
    style={styles.featureCard}
  >
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </Animated.View>
);

export default function FeaturesScreen() {
  const router = useRouter();

  const features = [
    {
      icon: '💰',
      title: 'Affordable Rides',
      description: 'Get to your destination without breaking the bank. Fair pricing for everyone.',
    },
    {
      icon: '📍',
      title: 'Live GPS Tracking',
      description: 'Track your driver in real-time and share your trip with loved ones.',
    },
    {
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'All drivers are verified. Your safety is our top priority.',
    },
  ];

  return (
    <LinearGradient colors={GRADIENTS.primary as any} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.header}
          >
            <Text style={styles.title}>Why Choose OpenRide?</Text>
            <Text style={styles.subtitle}>
              Experience the best ride-sharing service in town
            </Text>
          </Animated.View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={200 + index * 200}
              />
            ))}
          </View>
        </ScrollView>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={() => {
              console.log('Continue pressed');
              router.push('/onboarding/carousel');
            }}
            variant="secondary"
          />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.85,
  },
  featuresContainer: {
    gap: SPACING.lg,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 64,
  },
  featureTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
});
