import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useRiderStore } from '@/store/riderStore';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants';
import { OpenStreetMap } from '@/components/map/OpenStreetMap';
import { Ionicons } from '@expo/vector-icons';
import { getRoute } from '@/utils/getRoute';

const { height } = Dimensions.get('window');

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface Driver {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  vehicle: string;
  rating: number;
  fare: number;
  eta: number; // minutes
  distance: number; // km
}

export default function SelectRide() {
  const router = useRouter();
  const { pickup, destination, setCurrentTrip } = useRiderStore();
  
  // User's current location (from store or default)
  const [userLocation, setUserLocation] = useState({
    latitude: pickup?.latitude || 6.5244,
    longitude: pickup?.longitude || 3.3792,
  });
  
  // Destination from store
  const [tripDestination] = useState({
    latitude: destination?.latitude || 6.4281,
    longitude: destination?.longitude || 3.4219,
    address: destination?.address || 'Victoria Island, Lagos',
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [route, setRoute] = useState<{latitude: number, longitude: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get user location and generate nearby drivers
  useEffect(() => {
    (async () => {
      let lat = pickup?.latitude || 6.5244;
      let lng = pickup?.longitude || 3.3792;
      
      if (!pickup) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          try {
            const loc = await Location.getCurrentPositionAsync({});
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
          } catch (e) {
            console.log('Using default location');
          }
        }
      }
      
      setUserLocation({ latitude: lat, longitude: lng });
      
      // Generate mock drivers around user's location
      const mockDrivers: Driver[] = [
        {
          id: 'DRV001',
          name: 'Chidi Okonkwo',
          latitude: lat + 0.003,
          longitude: lng + 0.002,
          vehicle: 'Toyota Corolla (Black)',
          rating: 4.8,
          fare: 1500,
          eta: 3,
          distance: 0,
        },
        {
          id: 'DRV002', 
          name: 'Amaka Nwosu',
          latitude: lat - 0.002,
          longitude: lng + 0.004,
          vehicle: 'Honda Accord (White)',
          rating: 4.9,
          fare: 1800,
          eta: 5,
          distance: 0,
        },
        {
          id: 'DRV003',
          name: 'Emeka Adeyemi',
          latitude: lat + 0.001,
          longitude: lng - 0.003,
          vehicle: 'Keke NAPEP',
          rating: 4.5,
          fare: 800,
          eta: 2,
          distance: 0,
        },
        {
          id: 'DRV004',
          name: 'Funke Balogun',
          latitude: lat - 0.004,
          longitude: lng - 0.001,
          vehicle: 'Toyota Camry (Silver)',
          rating: 4.7,
          fare: 2000,
          eta: 7,
          distance: 0,
        },
      ];
      
      // Calculate distance for each driver
      const driversWithDistance = mockDrivers.map(d => ({
        ...d,
        distance: calculateDistance(lat, lng, d.latitude, d.longitude),
      })).sort((a, b) => a.distance - b.distance);
      
      setDrivers(driversWithDistance);
      setLoading(false);
    })();
  }, [pickup]);

  // Update route when driver is selected - use OSRM for road-following route
  useEffect(() => {
    if (selectedDriver) {
      setIsLoadingRoute(true);
      getRoute(
        { latitude: selectedDriver.latitude, longitude: selectedDriver.longitude },
        userLocation
      )
        .then((result) => {
          if (result.coords.length > 0) {
            setRoute(result.coords);
          } else {
            // Fallback to straight line if OSRM fails
            setRoute([
              { latitude: selectedDriver.latitude, longitude: selectedDriver.longitude },
              userLocation,
            ]);
          }
        })
        .catch(() => {
          // Fallback to straight line
          setRoute([
            { latitude: selectedDriver.latitude, longitude: selectedDriver.longitude },
            userLocation,
          ]);
        })
        .finally(() => {
          setIsLoadingRoute(false);
        });
    } else {
      setRoute([]);
    }
  }, [selectedDriver, userLocation]);

  function confirmBooking() {
    if (!selectedDriver) return;

    const trip = {
      id: `TR-${Date.now()}`,
      pickup: pickup || userLocation,
      destination: tripDestination,
      status: 'pending' as const,
      fare: selectedDriver.fare,
      createdAt: new Date().toISOString(),
      driver: { 
        name: selectedDriver.name, 
        rating: selectedDriver.rating,
        vehicle: selectedDriver.vehicle,
      },
    };

    setCurrentTrip(trip);
    // Navigate to driver-found (driver profile screen)
    router.replace('/rider/driver-found');
  }

  // Build markers for the map
  const mapMarkers = [
    // User pickup location
    {
      id: 'pickup',
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      title: 'Your Location',
      type: 'pickup' as const,
    },
    // All drivers
    ...drivers.map(d => ({
      id: d.id,
      latitude: d.latitude,
      longitude: d.longitude,
      title: `${d.name} - ${d.vehicle}`,
      type: 'driver' as const,
    })),
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Ride</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Pickup Point Info */}
      {pickup?.address && (
        <View style={styles.pickupInfo}>
          <View style={styles.pickupIconContainer}>
            <Ionicons name="navigate-circle" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.pickupTextContainer}>
            <Text style={styles.pickupLabel}>Meeting Point</Text>
            <Text style={styles.pickupAddress} numberOfLines={1}>{pickup.address}</Text>
          </View>
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          zoom={15}
          markers={mapMarkers}
          showUserLocation={true}
          route={route}
          routeColor={COLORS.primary}
          style={{ flex: 1 }}
        />
      </View>

      {/* Driver List */}
      <View style={styles.driversContainer}>
        <Text style={styles.sectionTitle}>
          {loading ? 'Finding drivers...' : `${drivers.length} Drivers Available`}
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.driversList}
        >
          {drivers.map((driver) => (
            <TouchableOpacity
              key={driver.id}
              style={[
                styles.driverCard,
                selectedDriver?.id === driver.id && styles.driverCardSelected,
              ]}
              onPress={() => setSelectedDriver(driver)}
            >
              <View style={styles.driverHeader}>
                <View style={styles.driverAvatar}>
                  <Text style={styles.avatarText}>{driver.name.charAt(0)}</Text>
                </View>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                </View>
              </View>
              
              <View style={styles.driverStats}>
                <View style={styles.stat}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.statText}>{driver.rating}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statText}>{driver.eta} min</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.statText}>{(driver.distance * 1000).toFixed(0)}m</Text>
                </View>
              </View>
              
              <View style={styles.fareContainer}>
                <Text style={styles.fareLabel}>Fare</Text>
                <Text style={styles.fareAmount}>₦{driver.fare.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Confirm Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedDriver && styles.confirmBtnDisabled]}
          onPress={confirmBooking}
          disabled={!selectedDriver}
        >
          <Text style={styles.confirmBtnText}>
            {selectedDriver 
              ? `Request ${selectedDriver.name.split(' ')[0]} - ₦${selectedDriver.fare.toLocaleString()}`
              : 'Select a Driver'
            }
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.md,
    color: COLORS.textPrimary,
  },
  pickupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  pickupIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickupTextContainer: {
    flex: 1,
  },
  pickupLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },
  pickupAddress: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  mapContainer: {
    height: height * 0.4,
    backgroundColor: COLORS.lightGray,
  },
  driversContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -20,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  driversList: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  driverCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
  },
  driverCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF5F2',
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZE.md,
  },
  driverInfo: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  driverName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },
  driverVehicle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  driverStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fareContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fareLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  fareAmount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    backgroundColor: COLORS.gray200,
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
});
