import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';
import { useVerificationStore } from '@/store/verificationStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const COLORS_LIST = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Gray', value: '#808080' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Brown', value: '#8B4513' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Other', value: 'other' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => CURRENT_YEAR - i);

interface VehicleFormData {
  make: string;
  model: string;
  year: number | null;
  color: string;
  licensePlate: string;
  seatsAvailable: number;
  photoFrontUri: string | null;
  photoBackUri: string | null;
  photoInteriorUri: string | null;
}

export default function VehicleRegistrationScreen() {
  const router = useRouter();
  const { registerVehicle, isLoading, error } = useVerificationStore();

  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: null,
    color: '',
    licensePlate: '',
    seatsAvailable: 4,
    photoFrontUri: null,
    photoBackUri: null,
    photoInteriorUri: null,
  });

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const updateForm = (field: keyof VehicleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickPhoto = async (type: 'front' | 'back' | 'interior') => {
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
      const fieldMap = {
        front: 'photoFrontUri',
        back: 'photoBackUri',
        interior: 'photoInteriorUri',
      } as const;
      updateForm(fieldMap[type], result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const { make, model, year, color, licensePlate, seatsAvailable, photoFrontUri } = formData;

    if (!make.trim()) {
      Alert.alert('Required', 'Please enter the vehicle make.');
      return;
    }

    if (!model.trim()) {
      Alert.alert('Required', 'Please enter the vehicle model.');
      return;
    }

    if (!year) {
      Alert.alert('Required', 'Please select the vehicle year.');
      return;
    }

    if (!color) {
      Alert.alert('Required', 'Please select the vehicle color.');
      return;
    }

    if (!licensePlate.trim()) {
      Alert.alert('Required', 'Please enter the license plate number.');
      return;
    }

    if (!photoFrontUri) {
      Alert.alert('Required', 'Please upload at least the front photo of your vehicle.');
      return;
    }

    try {
      await registerVehicle({
        make: make.trim(),
        model: model.trim(),
        year,
        color,
        licensePlate: licensePlate.toUpperCase().trim(),
        seatsAvailable,
        photoFrontUrl: photoFrontUri,
        photoBackUrl: formData.photoBackUri || undefined,
        photoInteriorUrl: formData.photoInteriorUri || undefined,
      });

      Alert.alert(
        'Vehicle Registered!',
        'Your vehicle has been registered successfully. You can now start offering rides!',
        [{ text: 'Get Started', onPress: () => router.replace('/driver/home') }]
      );
    } catch (err) {
      Alert.alert('Registration Failed', error || 'Please try again later.');
    }
  };

  const isFormValid =
    formData.make.trim() &&
    formData.model.trim() &&
    formData.year &&
    formData.color &&
    formData.licensePlate.trim() &&
    formData.photoFrontUri;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text style={styles.title}>Register Your Vehicle</Text>
          <Text style={styles.subtitle}>
            Add your vehicle details to start offering rides
          </Text>
        </Animated.View>

        {/* Make & Model */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Make</Text>
            <Input
              placeholder="e.g., Toyota"
              value={formData.make}
              onChangeText={(text) => updateForm('make', text)}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Model</Text>
            <Input
              placeholder="e.g., Camry"
              value={formData.model}
              onChangeText={(text) => updateForm('model', text)}
              autoCapitalize="words"
            />
          </View>
        </Animated.View>

        {/* Year & Color */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Year</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowYearPicker(!showYearPicker);
                setShowColorPicker(false);
              }}
            >
              <Text style={formData.year ? styles.selectorText : styles.selectorPlaceholder}>
                {formData.year || 'Select'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Color</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => {
                setShowColorPicker(!showColorPicker);
                setShowYearPicker(false);
              }}
            >
              <View style={styles.colorPreview}>
                {formData.color && formData.color !== 'Other' && (
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor:
                          COLORS_LIST.find((c) => c.name === formData.color)?.value || '#000',
                      },
                    ]}
                  />
                )}
                <Text style={formData.color ? styles.selectorText : styles.selectorPlaceholder}>
                  {formData.color || 'Select'}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color={COLORS.gray400} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Year Picker */}
        {showYearPicker && (
          <View style={styles.pickerContainer}>
            <ScrollView style={styles.pickerScroll} nestedScrollEnabled>
              {YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.pickerItem, formData.year === year && styles.pickerItemSelected]}
                  onPress={() => {
                    updateForm('year', year);
                    setShowYearPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      formData.year === year && styles.pickerItemTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Color Picker */}
        {showColorPicker && (
          <View style={styles.colorPickerContainer}>
            {COLORS_LIST.map((color) => (
              <TouchableOpacity
                key={color.name}
                style={[
                  styles.colorOption,
                  formData.color === color.name && styles.colorOptionSelected,
                ]}
                onPress={() => {
                  updateForm('color', color.name);
                  setShowColorPicker(false);
                }}
              >
                {color.value !== 'other' && (
                  <View style={[styles.colorSwatch, { backgroundColor: color.value }]} />
                )}
                <Text style={styles.colorName}>{color.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* License Plate */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.label}>License Plate Number</Text>
          <Input
            placeholder="e.g., ABC-123-XY"
            value={formData.licensePlate}
            onChangeText={(text) => updateForm('licensePlate', text.toUpperCase())}
            autoCapitalize="characters"
          />
        </Animated.View>

        {/* Seats */}
        <Animated.View entering={FadeInDown.delay(350).duration(500)} style={styles.section}>
          <Text style={styles.label}>Available Seats (excluding driver)</Text>
          <View style={styles.seatsContainer}>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.seatButton,
                  formData.seatsAvailable === num && styles.seatButtonSelected,
                ]}
                onPress={() => updateForm('seatsAvailable', num)}
              >
                <Text
                  style={[
                    styles.seatButtonText,
                    formData.seatsAvailable === num && styles.seatButtonTextSelected,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Vehicle Photos */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.section}>
          <Text style={styles.label}>Vehicle Photos</Text>
          <Text style={styles.photoHint}>Add photos of your vehicle (front required)</Text>
          <View style={styles.photosGrid}>
            <TouchableOpacity
              style={[styles.photoBox, !formData.photoFrontUri && styles.photoBoxRequired]}
              onPress={() => pickPhoto('front')}
            >
              {formData.photoFrontUri ? (
                <Image source={{ uri: formData.photoFrontUri }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="car-outline" size={32} color={COLORS.gray300} />
                  <Text style={styles.photoLabel}>Front *</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoBox} onPress={() => pickPhoto('back')}>
              {formData.photoBackUri ? (
                <Image source={{ uri: formData.photoBackUri }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="car-outline" size={32} color={COLORS.gray300} />
                  <Text style={styles.photoLabel}>Back</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.photoBox} onPress={() => pickPhoto('interior')}>
              {formData.photoInteriorUri ? (
                <Image source={{ uri: formData.photoInteriorUri }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="albums-outline" size={32} color={COLORS.gray300} />
                  <Text style={styles.photoLabel}>Interior</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          title="Register Vehicle"
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
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  halfInput: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
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
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  pickerContainer: {
    maxHeight: 200,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  pickerScroll: {
    maxHeight: 200,
  },
  pickerItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  pickerItemSelected: {
    backgroundColor: COLORS.primary + '15',
  },
  pickerItemText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.black,
  },
  pickerItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    gap: SPACING.xs,
  },
  colorOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  colorName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.black,
  },
  seatsContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  seatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  seatButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  seatButtonTextSelected: {
    color: COLORS.white,
  },
  photoHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  photoBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.gray50,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoBoxRequired: {
    borderColor: COLORS.primary + '50',
  },
  photoPlaceholder: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  photoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
