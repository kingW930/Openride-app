// app/driver/request.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDriverStore } from '@/store/driverStore';
import { socketService } from '@/services/socket';
import { driverAcceptRequest, driverRejectRequest } from '@/api/matchmaking';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants';

export default function DriverRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const store = useDriverStore();
  const request = store.currentRequest;

  if (!request) return null;

  async function handleAccept() {
    try {
      // 1) call matchmaking API to lock/accept
      await driverAcceptRequest(request.id, store.driverId || 'driver-local');

      // 2) emit to server via socket (so rider & system know)
      socketService.emit('driver:accept', { requestId: request.id, driverId: store.driverId || 'driver-local' });

      // 3) update local store
      store.acceptRequest();
      router.replace('/driver/trip');
    } catch (err: any) {
      console.error('accept err', err);
      Alert.alert('Error', err?.message || 'Failed to accept request');
    }
  }

  async function handleReject() {
    try {
      await driverRejectRequest(request.id, store.driverId || 'driver-local');
      socketService.emit('driver:reject', { requestId: request.id, driverId: store.driverId || 'driver-local' });
      store.setIncomingRequest(null);
      router.replace('/driver/home');
    } catch (err) {
      console.error('reject err', err);
      Alert.alert('Error', 'Unable to reject request');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>New Ride Request</Text>
        <Text style={styles.sub}>Rider: {request.riderName}</Text>
        <Text style={styles.sub}>Pickup: {request.pickup.address}</Text>

        <View style={styles.row}>
          <Pressable style={styles.reject} onPress={handleReject}>
            <Text style={{ color: COLORS.error }}>Reject</Text>
          </Pressable>

          <Pressable style={styles.accept} onPress={handleAccept}>
            <Text style={{ color: '#fff' }}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: '#0008' },
  card: { backgroundColor: '#fff', padding: SPACING.lg, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  sub: { marginTop: 6, color: '#444' },
  row: { flexDirection: 'row', marginTop: SPACING.lg, gap: SPACING.md },
  accept: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center' },
  reject: { flex: 1, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, alignItems: 'center' },
});
