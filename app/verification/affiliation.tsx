import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';
import { useVerificationStore } from '@/store/verificationStore';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AffiliationType, VerificationMethod } from '@/types/user';

interface AffiliationOptionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

const AffiliationOption: React.FC<AffiliationOptionProps> = ({
  icon,
  title,
  description,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.optionCard, selected && styles.optionCardSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
      <Ionicons name={icon} size={28} color={selected ? COLORS.white : COLORS.primary} />
    </View>
    <View style={styles.optionContent}>
      <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{title}</Text>
      <Text style={styles.optionDescription}>{description}</Text>
    </View>
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
      {selected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

export default function AffiliationVerificationScreen() {
  const router = useRouter();
  const { submitAffiliation, isLoading, error } = useVerificationStore();
  const updateUser = useAuthStore((state) => state.updateUser);
  const user = useAuthStore((state) => state.user);

  const [affiliationType, setAffiliationType] = useState<AffiliationType | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [idCardUri, setIdCardUri] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  const pickIdCard = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIdCardUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!affiliationType) {
      Alert.alert('Required', 'Please select your affiliation type.');
      return;
    }

    if (!organizationName.trim()) {
      Alert.alert('Required', 'Please enter your organization name.');
      return;
    }

    if (!verificationMethod) {
      Alert.alert('Required', 'Please select a verification method.');
      return;
    }

    if (verificationMethod === 'ID_CARD' && !idCardUri) {
      Alert.alert('Required', 'Please upload your ID card photo.');
      return;
    }

    if (verificationMethod === 'EMAIL' && !email.trim()) {
      Alert.alert('Required', 'Please enter your work/school email.');
      return;
    }

    // Validate email domain for organization
    if (verificationMethod === 'EMAIL') {
      const emailDomain = email.split('@')[1];
      if (!emailDomain || emailDomain.includes('gmail') || emailDomain.includes('yahoo') || emailDomain.includes('hotmail')) {
        Alert.alert(
          'Invalid Email',
          'Please use your official work or school email address, not a personal email.'
        );
        return;
      }
    }

    try {
      await submitAffiliation({
        affiliationType,
        organizationName: organizationName.trim(),
        verificationMethod,
        idCardUrl: verificationMethod === 'ID_CARD' ? idCardUri! : undefined,
        verificationEmail: verificationMethod === 'EMAIL' ? email.trim() : undefined,
      });

      updateUser({ kycStatus: 'AFFILIATION_PENDING' });

      if (verificationMethod === 'EMAIL') {
        Alert.alert(
          'Verification Email Sent',
          'Please check your email and click the verification link to complete this step.',
          [{ text: 'OK', onPress: () => router.push('/verification') }]
        );
      } else {
        const nextScreen = user?.role === 'CAPTAIN' ? '/verification/captain' : '/verification';
        Alert.alert(
          'Verification Submitted',
          'Your affiliation verification is being processed.',
          [{ text: 'Continue', onPress: () => router.push(nextScreen) }]
        );
      }
    } catch (err) {
      Alert.alert('Verification Failed', error || 'Please try again later.');
    }
  };

  const isFormValid =
    affiliationType &&
    organizationName.trim() &&
    verificationMethod &&
    (verificationMethod === 'ID_CARD' ? idCardUri : email.trim());

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.title}>Verify Your Affiliation</Text>
          <Text style={styles.subtitle}>
            OpenRide is exclusively for students and employed individuals. Please verify your status.
          </Text>
        </Animated.View>

        {/* Affiliation Type */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>I am a...</Text>
          <View style={styles.optionsContainer}>
            <AffiliationOption
              icon="school-outline"
              title="Student"
              description="Currently enrolled in a school/university"
              selected={affiliationType === 'STUDENT'}
              onPress={() => setAffiliationType('STUDENT')}
            />
            <AffiliationOption
              icon="briefcase-outline"
              title="Employee"
              description="Currently employed at an organization"
              selected={affiliationType === 'EMPLOYEE'}
              onPress={() => setAffiliationType('EMPLOYEE')}
            />
          </View>
        </Animated.View>

        {/* Organization Name */}
        {affiliationType && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {affiliationType === 'STUDENT' ? 'School/University Name' : 'Company/Organization Name'}
            </Text>
            <Input
              placeholder={
                affiliationType === 'STUDENT'
                  ? 'e.g., University of Lagos'
                  : 'e.g., Access Bank PLC'
              }
              value={organizationName}
              onChangeText={setOrganizationName}
              autoCapitalize="words"
              style={styles.input}
            />
          </Animated.View>
        )}

        {/* Verification Method */}
        {affiliationType && organizationName.trim() && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>How would you like to verify?</Text>
            <View style={styles.methodContainer}>
              <TouchableOpacity
                style={[
                  styles.methodCard,
                  verificationMethod === 'ID_CARD' && styles.methodCardSelected,
                ]}
                onPress={() => setVerificationMethod('ID_CARD')}
              >
                <Ionicons
                  name="card-outline"
                  size={24}
                  color={verificationMethod === 'ID_CARD' ? COLORS.primary : COLORS.gray400}
                />
                <Text
                  style={[
                    styles.methodText,
                    verificationMethod === 'ID_CARD' && styles.methodTextSelected,
                  ]}
                >
                  Upload ID Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodCard,
                  verificationMethod === 'EMAIL' && styles.methodCardSelected,
                ]}
                onPress={() => setVerificationMethod('EMAIL')}
              >
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={verificationMethod === 'EMAIL' ? COLORS.primary : COLORS.gray400}
                />
                <Text
                  style={[
                    styles.methodText,
                    verificationMethod === 'EMAIL' && styles.methodTextSelected,
                  ]}
                >
                  Verify Email
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* ID Card Upload */}
        {verificationMethod === 'ID_CARD' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {affiliationType === 'STUDENT' ? 'Student ID Card' : 'Employee ID Card'}
            </Text>
            <TouchableOpacity style={styles.uploadBox} onPress={pickIdCard} activeOpacity={0.7}>
              {idCardUri ? (
                <>
                  <Image source={{ uri: idCardUri }} style={styles.uploadedImage} />
                  <View style={styles.uploadOverlay}>
                    <Ionicons name="camera" size={24} color={COLORS.white} />
                    <Text style={styles.changeText}>Change</Text>
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={40} color={COLORS.gray300} />
                  <Text style={styles.uploadText}>
                    Tap to upload a photo of your ID card
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Email Verification */}
        {verificationMethod === 'EMAIL' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {affiliationType === 'STUDENT' ? 'School Email' : 'Work Email'}
            </Text>
            <Input
              placeholder={
                affiliationType === 'STUDENT'
                  ? 'yourname@university.edu.ng'
                  : 'yourname@company.com'
              }
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <Text style={styles.helperText}>
              We'll send a verification link to this email
            </Text>
          </Animated.View>
        )}

        {/* Info Box */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Either method is accepted. Choose whichever is more convenient for you.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          title="Submit Verification"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!isFormValid}
          style={styles.submitButton}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  optionsContainer: {
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionIconSelected: {
    backgroundColor: COLORS.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  optionTitleSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  input: {
    marginBottom: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  methodContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  methodCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    gap: SPACING.sm,
  },
  methodCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  methodText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  methodTextSelected: {
    color: COLORS.primary,
  },
  uploadBox: {
    height: 180,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  uploadText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  changeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  infoText: {
    flex: 1,
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
  submitButton: {
    width: '100%',
  },
});
