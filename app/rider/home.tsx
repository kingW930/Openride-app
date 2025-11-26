import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import * as Location from "expo-location";

import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from "@/constants";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

// Default region (Lagos, Nigeria)
const DEFAULT_REGION = {
  latitude: 6.5244,
  longitude: 3.3792,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function RiderHome() {
  const router = useRouter();

  const [region, setRegion] = useState<any>(DEFAULT_REGION);

  const mockDrivers = [
    { id: 1, lat: 6.6001, lng: 3.3512 },
    { id: 2, lat: 6.6025, lng: 3.3499 },
    { id: 3, lat: 6.5988, lng: 3.3542 },
  ];

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      });
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find your ride</Text>
        <Text style={styles.subtitle}>Drivers near you</Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          loadingEnabled={true}
          loadingIndicatorColor={COLORS.primary}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
        >
          {/* Nearby Drivers */}
          {mockDrivers.map((d) => (
            <Marker
              key={d.id}
              coordinate={{ latitude: d.lat, longitude: d.lng }}
            >
              <Icon name="truck" size={26} color={COLORS.black} />
            </Marker>
          ))}
        </MapView>
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        style={styles.rideBtn}
        onPress={() => router.push("/rider/select-ride")}
      >
        <Text style={styles.rideBtnText}>Request a Ride</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  header: { padding: SPACING.lg },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  mapContainer: {
    width: "100%",
    height: height * 0.67,
    backgroundColor: COLORS.lightGray,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },

  rideBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    margin: SPACING.lg,
    borderRadius: 12,
    alignItems: "center",
  },

  rideBtnText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: FONT_SIZE.md,
  },
});
