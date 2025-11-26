// app/_layout.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../src/store/authStore';
import { socketService } from '../src/services/socket';
import { registerForPushNotifications } from '../src/services/notifications';

export default function RootLayout() {
  const { initialize, user } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (user) {
      socketService.connect().catch(() => {});
      registerForPushNotifications();
    } else {
      socketService.disconnect();
    }
    return () => socketService.disconnect();
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="rider" />
        <Stack.Screen name="driver" />
      </Stack>
    </GestureHandlerRootView>
  );
}
