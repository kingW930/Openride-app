// app/rider/bookings.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRiderStore } from '@/store/riderStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';
import { useRouter } from 'expo-router';

export default function Bookings() {
  const router = useRouter();
  const { tripHistory } = useRiderStore();

  // If store empty show placeholders so UI is never blank
  const placeholder = [
    {
      id: 'T-001',
      pickup: { address: 'Ikeja' },
      destination: { address: 'Victoria Island' },
      status: 'pending' as const,
      fare: 1200,
      createdAt: new Date().toISOString(),
      driver: null,
    },
    {
      id: 'T-002',
      pickup: { address: 'Yaba' },
      destination: { address: 'Lekki' },
      status: 'completed' as const,
      fare: 900,
      createdAt: new Date().toISOString(),
      driver: { name: 'Jane Smith', rating: 4.7, vehicleNumber: 'ABC 123 XY' },
    },
  ];

  const data = tripHistory.length ? tripHistory : placeholder;

  const getPickupAddress = (pickup: any) => typeof pickup === 'string' ? pickup : pickup.address;
  const getDestinationAddress = (destination: any) => typeof destination === 'string' ? destination : destination.address;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bookings</Text>

      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: SPACING.xl }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/rider/trip?id=${item.id}`)}>
            <View style={styles.cardRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tripId}>#{item.id}</Text>
                <Text style={styles.address}>{getPickupAddress(item.pickup)} → {getDestinationAddress(item.destination)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.status, item.status === 'completed' ? styles.statusCompleted : styles.statusPending]}>
                  {item.status.toUpperCase()}
                </Text>
                <Text style={styles.fare}>₦{item.fare}</Text>
              </View>
            </View>
            {item.driver && (
              <View style={styles.driverRow}>
                <Text style={styles.driverText}>{item.driver.name} • {item.driver.vehicleNumber}</Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  title: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md, color: COLORS.textPrimary },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  tripId: { fontWeight: '600', marginBottom: 4 },
  address: { color: COLORS.textSecondary },
  status: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  statusPending: { color: COLORS.warning },
  statusCompleted: { color: COLORS.success },
  fare: { marginTop: 6, fontWeight: FONT_WEIGHT.bold, color: COLORS.primary },
  driverRow: { marginTop: SPACING.sm },
  driverText: { color: COLORS.textSecondary },
});
