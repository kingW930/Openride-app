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
import type { GovernmentIdType } from '@/types/user';

const ID_TYPES: { value: GovernmentIdType; label: string }[] = [
  { value: 'NATIONAL_ID', label: 'National ID Card' },
  { value: 'NIN_SLIP', label: 'NIN Slip' },
  { value: 'INTERNATIONAL_PASSPORT', label: 'International Passport' },
  { value: 'VOTERS_CARD', label: "Voter's Card" },
  { value: 'DRIVERS_LICENSE', label: "Driver's License" },
];

interface ImageUploadBoxProps {
  label: string;
  description: string;
  imageUri: string | null;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  label,
  description,
  imageUri,
  onPress,
  icon,
}) => (
  <View style={styles.uploadContainer}>
    <Text style={styles.uploadLabel}>{label}</Text>
    <TouchableOpacity style={styles.uploadBox} onPress={onPress} activeOpacity={0.7}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
      ) : (
        <View style={styles.uploadPlaceholder}>
          <Ionicons name={icon} size={40} color={COLORS.gray300} />
          <Text style={styles.uploadText}>{description}</Text>
        </View>
      )}
      {imageUri && (
        <View style={styles.uploadOverlay}>
          <Ionicons name="camera" size={24} color={COLORS.white} />
          <Text style={styles.changeText}>Change</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default function IdentityVerificationScreen() {
  const router = useRouter();
  const { submitIdentity, isLoading, error } = useVerificationStore();
  const updateUser = useAuthStore((state) => state.updateUser);

  const [nin, setNin] = useState('');
  const [selectedIdType, setSelectedIdType] = useState<GovernmentIdType | null>(null);
  const [idImageUri, setIdImageUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [showIdTypePicker, setShowIdTypePicker] = useState(false);

  const pickImage = async (type: 'id' | 'selfie') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'selfie' ? [1, 1] : [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      if (type === 'id') {
        setIdImageUri(result.assets[0].uri);
      } else {
        setSelfieUri(result.assets[0].uri);
      }
    }
  };

  const takeSelfie = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled && result.assets[0]) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!nin || nin.length !== 11) {
      Alert.alert('Invalid NIN', 'Please enter a valid 11-digit NIN.');
      return;
    }

    if (!selectedIdType) {
      Alert.alert('ID Type Required', 'Please select your government ID type.');
      return;
    }

    if (!idImageUri) {
      Alert.alert('ID Image Required', 'Please upload a photo of your government ID.');
      return;
    }

    if (!selfieUri) {
      Alert.alert('Selfie Required', 'Please take a selfie for verification.');
      return;
    }

    try {
      // In production, upload images to cloud storage first and get URLs
      // For now, using local URIs (backend would handle upload)
      await submitIdentity({
        nin,
        governmentIdType: selectedIdType,
        governmentIdUrl: idImageUri, // Would be cloud URL in production
        selfieUrl: selfieUri, // Would be cloud URL in production
      });

      // Update user KYC status locally
      updateUser({ kycStatus: 'IDENTITY_PENDING' });

      Alert.alert(
        'Verification Submitted',
        'Your identity verification is being processed. This usually takes a few minutes.',
        [{ text: 'Continue', onPress: () => router.push('/verification/affiliation') }]
      );
    } catch (err) {
      Alert.alert('Verification Failed', error || 'Please try again later.');
    }
  };

  const isFormValid = nin.length === 11 && selectedIdType && idImageUri && selfieUri;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.title}>Verify Your Identity</Text>
          <Text style={styles.subtitle}>
            We need to verify your identity using your NIN and a government-issued ID.
          </Text>
        </Animated.View>

        {/* NIN Input */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>National Identification Number (NIN)</Text>
          <Input
            placeholder="Enter your 11-digit NIN"
            value={nin}
            onChangeText={(text) => setNin(text.replace(/\D/g, '').slice(0, 11))}
            keyboardType="number-pad"
            maxLength={11}
            style={styles.input}
          />
          <Text style={styles.helperText}>
            Your NIN will be verified with NIMC database
          </Text>
        </Animated.View>

        {/* ID Type Selector */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Government ID Type</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowIdTypePicker(!showIdTypePicker)}
            activeOpacity={0.7}
          >
            <Text style={selectedIdType ? styles.selectorText : styles.selectorPlaceholder}>
              {selectedIdType
                ? ID_TYPES.find((t) => t.value === selectedIdType)?.label
                : 'Select ID type'}
            </Text>
            <Ionicons
              name={showIdTypePicker ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.gray400}
            />
          </TouchableOpacity>

          {showIdTypePicker && (
            <View style={styles.pickerContainer}>
              {ID_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.pickerItem,
                    selectedIdType === type.value && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedIdType(type.value);
                    setShowIdTypePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      selectedIdType === type.value && styles.pickerItemTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                  {selectedIdType === type.value && (
                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* ID Upload */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <ImageUploadBox
            label="Government ID Photo"
            description="Take or upload a clear photo of your ID"
            imageUri={idImageUri}
            onPress={() => pickImage('id')}
            icon="card-outline"
          />
        </Animated.View>

        {/* Selfie */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
          <ImageUploadBox
            label="Selfie Verification"
            description="Take a clear selfie of your face"
            imageUri={selfieUri}
            onPress={takeSelfie}
            icon="person-circle-outline"
          />
          <TouchableOpacity style={styles.galleryLink} onPress={() => pickImage('selfie')}>
            <Text style={styles.galleryLinkText}>Or choose from gallery</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Info */}
        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.infoBox}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Your data is encrypted and securely stored. We only use it for identity verification.
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
  input: {
    marginBottom: SPACING.xs,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  selectorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  selectorPlaceholder: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray400,
  },
  pickerContainer: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  pickerItemSelected: {
    backgroundColor: COLORS.primary + '10',
  },
  pickerItemText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  pickerItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  uploadContainer: {
    marginBottom: SPACING.sm,
  },
  uploadLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
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
  galleryLink: {
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  galleryLinkText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
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
