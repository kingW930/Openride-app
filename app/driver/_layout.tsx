import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="incoming-request" />
      <Stack.Screen name="request" />
      <Stack.Screen name="create-route" />
      <Stack.Screen name="trip" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
