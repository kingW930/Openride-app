import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, sizes } from '../../src/constants';

export default function DriverProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', route: '/driver/edit-profile' },
    { icon: '🚗', label: 'Vehicle Information', route: '/driver/vehicle' },
    { icon: '📜', label: 'Trip History', route: '/driver/history' },
    { icon: '💰', label: 'Earnings & Payouts', route: '/driver/earnings' },
    { icon: '📝', label: 'My Routes', route: '/driver/routes' },
    { icon: '📄', label: 'Documents & KYC', route: '/driver/documents' },
    { icon: '⭐', label: 'Ratings & Reviews', route: '/driver/ratings' },
    { icon: '❓', label: 'Help & Support', route: '/driver/support' },
    { icon: '⚙️', label: 'Settings', route: '/driver/settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'D'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Driver'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌟 {user?.rating?.toFixed(1) || '5.0'}</Text>
          </View>
          <View style={[styles.badge, styles.kycBadge]}>
            <Text style={styles.badgeText}>
              {user?.kycStatus === 'VERIFIED' ? '✓ Verified' : '⏳ Pending'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Total Trips</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₦0</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {}}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>OpenRide Driver v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: sizes.xl,
    backgroundColor: colors.white,
    marginBottom: sizes.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  name: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  phone: {
    fontSize: sizes.fontMd,
    color: colors.textSecondary,
    marginBottom: sizes.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: sizes.sm,
  },
  badge: {
    backgroundColor: colors.light,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderRadius: sizes.radiusFull,
  },
  kycBadge: {
    backgroundColor: colors.success,
  },
  badgeText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: sizes.md,
    paddingHorizontal: sizes.md,
    marginBottom: sizes.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  statValue: {
    fontSize: sizes.fontXl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: sizes.xs,
  },
  statLabel: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  menu: {
    backgroundColor: colors.white,
    marginBottom: sizes.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: sizes.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: sizes.fontMd,
    color: colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.gray,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    margin: sizes.md,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.white,
    fontSize: sizes.fontMd,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: sizes.xl,
  },
  version: {
    fontSize: sizes.fontSm,
    color: colors.gray,
  },
});
