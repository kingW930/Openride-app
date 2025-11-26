import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { COLORS } from "@/constants";

export default function RiderLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="map" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "Bookings",
          tabBarIcon: ({ color }) => (
            <Icon name="clipboard" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" size={22} color={color} />
          ),
        }}
      />

      {/* Hidden screens - not shown in tab bar */}
      <Tabs.Screen
        name="select-ride"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="searching"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="driver-found"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="trip"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="trip-complete"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
