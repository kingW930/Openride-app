import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';
import { useAuthStore } from '@/store/authStore';
import { useVerificationStore } from '@/store/verificationStore';
import { Button } from '@/components/ui/Button';

interface VerificationStepProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending' | 'rejected';
  onPress?: () => void;
  delay: number;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  icon,
  title,
  description,
  status,
  onPress,
  delay,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return COLORS.success;
      case 'current':
        return COLORS.primary;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.gray300;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'current':
        return 'arrow-forward-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'ellipse-outline';
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500)}>
      <TouchableOpacity
        style={[
          styles.stepCard,
          status === 'current' && styles.stepCardActive,
          status === 'completed' && styles.stepCardCompleted,
          status === 'rejected' && styles.stepCardRejected,
        ]}
        onPress={onPress}
        disabled={status === 'pending' || status === 'completed'}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: getStatusColor() + '20' }]}>
          <Ionicons name={icon} size={28} color={getStatusColor()} />
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepDescription}>{description}</Text>
        </View>
        <Ionicons name={getStatusIcon()} size={24} color={getStatusColor()} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function VerificationIndexScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { status, fetchStatus, isLoading } = useVerificationStore();

  useEffect(() => {
    fetchStatus().catch(console.error);
  }, []);

  const getIdentityStatus = (): 'completed' | 'current' | 'pending' | 'rejected' => {
    if (!status) return 'current';
    if (status.identity.verified) return 'completed';
    if (status.identity.rejectionReason) return 'rejected';
    if (status.identity.submitted) return 'pending';
    return 'current';
  };

  const getAffiliationStatus = (): 'completed' | 'current' | 'pending' | 'rejected' => {
    if (!status) return 'pending';
    if (status.affiliation.verified) return 'completed';
    if (status.affiliation.rejectionReason) return 'rejected';
    if (status.affiliation.submitted) return 'pending';
    if (status.identity.verified) return 'current';
    return 'pending';
  };

  const getCaptainStatus = (): 'completed' | 'current' | 'pending' | 'rejected' => {
    if (!status || !status.captain) return 'pending';
    if (status.captain.verified) return 'completed';
    if (status.captain.rejectionReason) return 'rejected';
    if (status.captain.submitted) return 'pending';
    if (status.affiliation.verified && user?.role === 'CAPTAIN') return 'current';
    return 'pending';
  };

  const handleContinue = () => {
    if (!status) {
      router.push('/verification/identity');
      return;
    }

    if (!status.identity.verified && !status.identity.submitted) {
      router.push('/verification/identity');
    } else if (!status.affiliation.verified && !status.affiliation.submitted) {
      router.push('/verification/affiliation');
    } else if (user?.role === 'CAPTAIN' && !status.captain?.verified && !status.captain?.submitted) {
      router.push('/verification/captain');
    } else if (user?.role === 'CAPTAIN' && status.captain?.verified && status.vehicles.length === 0) {
      router.push('/verification/vehicle');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: status?.canBookRides
                      ? '100%'
                      : status?.affiliation.verified
                      ? '66%'
                      : status?.identity.verified
                      ? '33%'
                      : '0%',
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {status?.canBookRides
                ? 'Verified!'
                : status?.affiliation.verified
                ? '2 of 3 complete'
                : status?.identity.verified
                ? '1 of 3 complete'
                : '0 of 3 complete'}
            </Text>
          </View>
          <Text style={styles.title}>Complete Your Verification</Text>
          <Text style={styles.subtitle}>
            Verify your identity to start booking rides. All users must be verified students or employees.
          </Text>
        </Animated.View>

        {/* Verification Steps */}
        <View style={styles.stepsContainer}>
          <VerificationStep
            icon="finger-print-outline"
            title="Identity Verification"
            description="Verify your NIN and upload a government ID"
            status={getIdentityStatus()}
            onPress={() => router.push('/verification/identity')}
            delay={100}
          />

          <VerificationStep
            icon="business-outline"
            title="Work/Student Verification"
            description="Confirm you're a student or employed"
            status={getAffiliationStatus()}
            onPress={() => router.push('/verification/affiliation')}
            delay={200}
          />

          {user?.role === 'CAPTAIN' && (
            <>
              <VerificationStep
                icon="car-outline"
                title="Captain Verification"
                description="Submit your driver's license"
                status={getCaptainStatus()}
                onPress={() => router.push('/verification/captain')}
                delay={300}
              />

              {status?.captain?.verified && (
                <VerificationStep
                  icon="car-sport-outline"
                  title="Register Vehicle"
                  description="Add your vehicle details"
                  status={status.vehicles.length > 0 ? 'completed' : 'current'}
                  onPress={() => router.push('/verification/vehicle')}
                  delay={400}
                />
              )}
            </>
          )}
        </View>

        {/* Info Box */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.infoBox}>
          <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Why we verify</Text>
            <Text style={styles.infoText}>
              OpenRide is exclusively for students and employees. Verification keeps our community safe and trustworthy.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <Button
          title={status?.canBookRides ? 'Done' : 'Continue Verification'}
          onPress={status?.canBookRides ? () => router.back() : handleContinue}
          loading={isLoading}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray100,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  stepsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  stepCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  stepCardCompleted: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '08',
  },
  stepCardRejected: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '08',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    gap: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  continueButton: {
    width: '100%',
  },
});
