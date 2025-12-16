import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SPACING, RADIUS, FONT_SIZE, BORDER_WIDTH } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

interface DocumentUploadProps {
  label: string;
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  error?: string;
}

export function DocumentUpload({ label, imageUri, onImageSelected, error }: DocumentUploadProps) {
  const [loading, setLoading] = React.useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[
          styles.uploadBox, 
          error ? styles.errorBorder : null,
          imageUri ? styles.hasImage : null
        ]} 
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="cloud-upload-outline" size={32} color={COLORS.textTertiary} />
            <Text style={styles.placeholderText}>Tap to upload</Text>
          </View>
        )}
        
        {imageUri && (
          <View style={styles.editOverlay}>
            <Ionicons name="pencil" size={16} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  uploadBox: {
    height: 150,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  hasImage: {
    borderStyle: 'solid',
    borderWidth: 0,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: SPACING.xs,
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  editOverlay: {
    position: 'absolute',
    bottom: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});
