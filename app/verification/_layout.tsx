import { Stack } from 'expo-router';
import { COLORS } from '@/constants';

export default function VerificationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.black,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="identity"
        options={{
          title: 'Identity Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="affiliation"
        options={{
          title: 'Work/Student Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="captain"
        options={{
          title: 'Captain Verification',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="vehicle"
        options={{
          title: 'Register Vehicle',
          headerShown: true,
        }}
      />
    </Stack>
  );
}
