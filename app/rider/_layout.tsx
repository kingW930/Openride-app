import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="searching" />
      <Stack.Screen name="trip" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
