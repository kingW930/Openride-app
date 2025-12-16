import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE } from '@/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DocumentUpload } from '@/components/driver/DocumentUpload';
import { submitKYC, registerVehicle } from '@/api/user';
import { KYCSubmission } from '@/types/api';

export default function KYCScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Vehicle State
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    licensePlate: '',
    seats: '',
  });

  // Documents State
  const [documents, setDocuments] = useState<{
    driversLicense: string;
    vehicleRegistration: string;
    insurance: string;
    profilePhoto: string;
  }>({
    driversLicense: '',
    vehicleRegistration: '',
    insurance: '',
    profilePhoto: '',
  });

  const handleVehicleChange = (field: string, value: string) => {
    setVehicle(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentSelect = (field: keyof KYCSubmission, uri: string) => {
    setDocuments(prev => ({ ...prev, [field]: uri }));
  };

  const validateVehicle = () => {
    if (!vehicle.make || !vehicle.model || !vehicle.year || !vehicle.licensePlate || !vehicle.seats) {
      Alert.alert('Error', 'Please fill in all vehicle details');
      return false;
    }
    return true;
  };

  const validateDocuments = () => {
    if (!documents.driversLicense || !documents.vehicleRegistration || !documents.insurance || !documents.profilePhoto) {
      Alert.alert('Error', 'Please upload all required documents');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (validateVehicle()) {
      try {
        setLoading(true);
        // Register vehicle first
        await registerVehicle({
          ...vehicle,
          year: parseInt(vehicle.year),
          seats: parseInt(vehicle.seats),
        });
        setStep(2);
      } catch (error) {
        Alert.alert('Error', 'Failed to register vehicle. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (validateDocuments()) {
      try {
        setLoading(true);
        await submitKYC(documents);
        Alert.alert(
          'Success',
          'KYC documents submitted successfully. We will review them shortly.',
          [{ text: 'OK', onPress: () => router.replace('/driver/home') }]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to submit documents. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Driver Verification</Text>
          <Text style={styles.subtitle}>
            Step {step} of 2: {step === 1 ? 'Vehicle Details' : 'Document Upload'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {step === 1 ? (
            <View style={styles.form}>
              <Input
                label="Vehicle Make"
                placeholder="e.g. Toyota"
                value={vehicle.make}
                onChangeText={(t: string) => handleVehicleChange('make', t)}
              />
              <Input
                label="Vehicle Model"
                placeholder="e.g. Camry"
                value={vehicle.model}
                onChangeText={(t: string) => handleVehicleChange('model', t)}
              />
              <View style={styles.row}>
                <Input
                  label="Year"
                  placeholder="2015"
                  keyboardType="numeric"
                  containerStyle={{ flex: 1, marginRight: SPACING.sm }}
                  value={vehicle.year}
                  onChangeText={(t: string) => handleVehicleChange('year', t)}
                />
                <Input
                  label="Color"
                  placeholder="Silver"
                  containerStyle={{ flex: 1 }}
                  value={vehicle.color}
                  onChangeText={(t: string) => handleVehicleChange('color', t)}
                />
              </View>
              <Input
                label="License Plate"
                placeholder="ABC-123DE"
                autoCapitalize="characters"
                value={vehicle.licensePlate}
                onChangeText={(t: string) => handleVehicleChange('licensePlate', t)}
              />
              <Input
                label="Available Seats"
                placeholder="3"
                keyboardType="numeric"
                value={vehicle.seats}
                onChangeText={(t: string) => handleVehicleChange('seats', t)}
                helperText="Number of passengers you can carry"
              />
            </View>
          ) : (
            <View style={styles.form}>
              <DocumentUpload
                label="Driver's License"
                imageUri={documents.driversLicense}
                onImageSelected={(uri: string) => handleDocumentSelect('driversLicense', uri)}
              />
              <DocumentUpload
                label="Vehicle Registration"
                imageUri={documents.vehicleRegistration}
                onImageSelected={(uri: string) => handleDocumentSelect('vehicleRegistration', uri)}
              />
              <DocumentUpload
                label="Insurance Certificate"
                imageUri={documents.insurance}
                onImageSelected={(uri: string) => handleDocumentSelect('insurance', uri)}
              />
              <DocumentUpload
                label="Profile Photo"
                imageUri={documents.profilePhoto}
                onImageSelected={(uri: string) => handleDocumentSelect('profilePhoto', uri)}
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step === 1 ? (
            <Button title="Next Step" onPress={handleNext} loading={loading} />
          ) : (
            <View style={styles.buttonGroup}>
              <Button 
                title="Back" 
                variant="outline" 
                onPress={() => setStep(1)} 
                style={{ flex: 1, marginRight: SPACING.sm }}
                disabled={loading}
              />
              <Button 
                title="Submit Application" 
                onPress={handleSubmit} 
                loading={loading}
                style={{ flex: 2 }}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  content: {
    padding: SPACING.lg,
  },
  form: {
    gap: SPACING.md,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
});
