// app/rider/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';
import Icon from 'react-native-vector-icons/Feather';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0)}</Text>
        </View>
        <View style={{ marginLeft: SPACING.md }}>
          <Text style={styles.name}>{user?.name || 'Test User'}</Text>
          <Text style={styles.email}>{user?.email || user?.phone || 'No email'}</Text>
        </View>
      </View>

      <View style={{ marginTop: SPACING.lg }}>
        <Pressable style={styles.item} onPress={() => router.push('/rider/profile')}>
          <Icon name="user" size={18} color={COLORS.textPrimary} />
          <Text style={styles.itemText}>Profile</Text>
        </Pressable>

        <Pressable style={styles.item} onPress={() => router.push('/rider/bookings')}>
          <Icon name="clipboard" size={18} color={COLORS.textPrimary} />
          <Text style={styles.itemText}>Bookings</Text>
        </Pressable>

        <Pressable style={[styles.item, { marginTop: SPACING.md }]} onPress={() => { logout(); router.replace('/auth/login'); }}>
          <Icon name="log-out" size={18} color={COLORS.textPrimary} />
          <Text style={[styles.itemText, { color: COLORS.error }]}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: SPACING.lg, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.textOnPrimary, fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.xl },
  name: { fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.md, color: COLORS.textPrimary },
  email: { color: COLORS.textSecondary, marginTop: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemText: { marginLeft: SPACING.sm, fontSize: FONT_SIZE.md, color: COLORS.textPrimary },
});
