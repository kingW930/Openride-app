import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { colors, sizes } from '../../constants';

interface RatingModalProps {
  visible: boolean;
  driverName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  driverName,
  onSubmit,
  onClose,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      return;
    }
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <Modal visible={visible} title="Rate Your Trip" onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>How was your ride with {driverName}?</Text>

        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Text style={[styles.star, rating >= star && styles.starFilled]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Add a comment (optional)"
          placeholderTextColor={colors.gray}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Button
          title="Submit Rating"
          onPress={handleSubmit}
          disabled={rating === 0}
          variant="primary"
        />

        <TouchableOpacity onPress={onClose} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: sizes.md,
  },
  subtitle: {
    fontSize: sizes.fontMd,
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.xl,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: sizes.xl,
  },
  starButton: {
    padding: sizes.sm,
  },
  star: {
    fontSize: 40,
    color: colors.border,
  },
  starFilled: {
    color: colors.warning,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
    fontSize: sizes.fontMd,
    color: colors.text,
    marginBottom: sizes.lg,
    minHeight: 100,
  },
  skipButton: {
    marginTop: sizes.md,
    alignItems: 'center',
  },
  skipText: {
    color: colors.gray,
    fontSize: sizes.fontSm,
  },
});
