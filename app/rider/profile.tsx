import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, sizes } from '../../src/constants';

export default function RiderProfile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', route: '/rider/edit-profile' },
    { icon: '📜', label: 'Trip History', route: '/rider/history' },
    { icon: '💳', label: 'Payment Methods', route: '/rider/payments' },
    { icon: '⭐', label: 'Ratings & Reviews', route: '/rider/ratings' },
    { icon: '❓', label: 'Help & Support', route: '/rider/support' },
    { icon: '⚙️', label: 'Settings', route: '/rider/settings' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'R'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Rider'}</Text>
        <Text style={styles.phone}>{user?.phone}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🌟 {user?.rating?.toFixed(1) || '5.0'}</Text>
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
        <Text style={styles.version}>OpenRide v1.0.0</Text>
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
  badge: {
    backgroundColor: colors.light,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.xs,
    borderRadius: sizes.radiusFull,
  },
  badgeText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.text,
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
