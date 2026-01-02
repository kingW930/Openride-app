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

export default function CaptainVerificationScreen() {
  const router = useRouter();
  const { submitCaptain, isLoading, error } = useVerificationStore();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImageUri, setLicenseImageUri] = useState<string | null>(null);

  const pickLicenseImage = async () => {
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
      setLicenseImageUri(result.assets[0].uri);
    }
  };

  const takeLicensePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLicenseImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validate license number format (Nigerian driver's license)
    const licenseRegex = /^[A-Z0-9]{10,20}$/;
    const cleanLicense = licenseNumber.toUpperCase().replace(/\s/g, '');

    if (!licenseRegex.test(cleanLicense)) {
      Alert.alert(
        'Invalid License Number',
        'Please enter a valid Nigerian driver\'s license number.'
      );
      return;
    }

    if (!licenseImageUri) {
      Alert.alert('Required', 'Please upload a photo of your driver\'s license.');
      return;
    }

    try {
      await submitCaptain({
        licenseNumber: cleanLicense,
        licensePhotoUrl: licenseImageUri, // Would be cloud URL in production
      });

      updateUser({ kycStatus: 'CAPTAIN_PENDING' });

      Alert.alert(
        'Verification Submitted',
        'Your captain verification is being processed. Once approved, you can register your vehicle and start offering rides.',
        [{ text: 'Continue', onPress: () => router.push('/verification/vehicle') }]
      );
    } catch (err) {
      Alert.alert('Verification Failed', error || 'Please try again later.');
    }
  };

  const isFormValid = licenseNumber.length >= 10 && licenseImageUri;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View style={styles.iconHeader}>
            <Ionicons name="car-sport" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Become a Captain</Text>
          <Text style={styles.subtitle}>
            Submit your driver's license to start offering rides and earning money on OpenRide.
          </Text>
        </Animated.View>

        {/* License Number */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's License Number</Text>
          <Input
            placeholder="Enter your license number"
            value={licenseNumber}
            onChangeText={(text) => setLicenseNumber(text.toUpperCase())}
            autoCapitalize="characters"
            style={styles.input}
          />
          <Text style={styles.helperText}>
            Your license will be verified with FRSC database
          </Text>
        </Animated.View>

        {/* License Photo */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Driver's License Photo</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={takeLicensePhoto}
            activeOpacity={0.7}
          >
            {licenseImageUri ? (
              <>
                <Image source={{ uri: licenseImageUri }} style={styles.uploadedImage} />
                <View style={styles.uploadOverlay}>
                  <Ionicons name="camera" size={24} color={COLORS.white} />
                  <Text style={styles.changeText}>Change</Text>
                </View>
              </>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera-outline" size={48} color={COLORS.gray300} />
                <Text style={styles.uploadText}>
                  Take a clear photo of your driver's license
                </Text>
                <Text style={styles.uploadHint}>
                  Make sure all details are visible
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryLink} onPress={pickLicenseImage}>
            <Ionicons name="images-outline" size={18} color={COLORS.primary} />
            <Text style={styles.galleryLinkText}>Choose from gallery</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Requirements */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.requirements}>
          <Text style={styles.requirementsTitle}>License Requirements</Text>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.requirementText}>Valid Nigerian driver's license</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.requirementText}>Not expired (at least 3 months validity)</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.requirementText}>Clear, readable photo</Text>
          </View>
        </Animated.View>

        {/* Info Box */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.infoBox}>
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Verification usually takes 5-10 minutes. We'll notify you once it's complete.
          </Text>
        </Animated.View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          title="Submit for Verification"
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
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconHeader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    textAlign: 'center',
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
  input: {
    marginBottom: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  uploadBox: {
    height: 200,
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
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
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
  galleryLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  galleryLinkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  requirements: {
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  requirementsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  requirementText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    gap: SPACING.sm,
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
