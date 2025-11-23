import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';
import { socketService } from '../src/services/socket';
import { registerForPushNotifications } from '../src/services/notifications';

export default function RootLayout() {
  const { initialize, user } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from secure storage
    initialize();
  }, []);

  useEffect(() => {
    // Connect socket when authenticated
    if (user) {
      socketService.connect();
      registerForPushNotifications();
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="rider" />
        <Stack.Screen name="driver" />
      </Stack>
    </>
  );
}
