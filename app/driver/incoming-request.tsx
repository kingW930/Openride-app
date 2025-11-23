import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, sizes } from '../../src/constants';

export default function IncomingRequest() {
  const router = useRouter();

  const handleAccept = () => {
    // Accept ride request logic
    router.replace('/driver/trip');
  };

  const handleReject = () => {
    // Reject ride request logic
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🚗 New Ride Request</Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rider:</Text>
            <Text style={styles.value}>John Doe ⭐ 4.8</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pickup:</Text>
            <Text style={styles.value}>Ikeja Bus Stop</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Dropoff:</Text>
            <Text style={styles.value}>Victoria Island</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>12.5 km</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Fare:</Text>
            <Text style={styles.fareValue}>₦2,500</Text>
          </View>
        </View>

        <View style={styles.timer}>
          <Text style={styles.timerText}>⏱️ Auto-reject in 30 seconds</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: sizes.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: sizes.radiusXl,
    padding: sizes.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.lg,
  },
  infoSection: {
    marginBottom: sizes.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: sizes.fontMd,
    color: colors.textSecondary,
  },
  value: {
    fontSize: sizes.fontMd,
    color: colors.text,
    fontWeight: '600',
  },
  fareValue: {
    fontSize: sizes.fontMd,
    color: colors.primary,
    fontWeight: 'bold',
  },
  timer: {
    backgroundColor: colors.light,
    padding: sizes.sm,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
    marginBottom: sizes.lg,
  },
  timerText: {
    fontSize: sizes.fontSm,
    color: colors.warning,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: sizes.md,
  },
  rejectButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.danger,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  rejectText: {
    color: colors.danger,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.success,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  acceptText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
});
