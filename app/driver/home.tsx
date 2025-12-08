// app/driver/home.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

import { useAuthStore } from '@/store/authStore';
import { useDriverStore } from '@/store/driverStore';
import { OpenStreetMap } from '@/components/map/OpenStreetMap';
import { getRoute } from '@/utils/getRoute';
import { searchLocationsNominatim, LocationSuggestion } from '@/api/locations';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SHADOW,
} from '@/constants';

const { height } = Dimensions.get('window');

// Default location (Lagos, Nigeria)
const DEFAULT_LAT = 6.5244;
const DEFAULT_LNG = 3.3792;

export default function DriverHome() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    isOnline, 
    setOnlineStatus, 
    pendingRequests,
    tripStats,
    setCurrentLocation,
    setDestination,
    currentLocation,
  } = useDriverStore();

  const [userLat, setUserLat] = useState(DEFAULT_LAT);
  const [userLng, setUserLng] = useState(DEFAULT_LNG);
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);

  // Driver's set destination (where they're heading)
  const [driverDestination, setDriverDestination] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  // Route from driver to their destination
  const [route, setRoute] = useState<{latitude: number; longitude: number}[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Destination search states
  const [showDestinationSearch, setShowDestinationSearch] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState('');
  const [destinationSuggestions, setDestinationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get initial location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this app');
        setLocationLoaded(true);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);
        setCurrentLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (e) {
        console.log('Using default location');
      }
      setLocationLoaded(true);
    })();
  }, []);

  // Start/stop location tracking when online status changes
  useEffect(() => {
    if (isOnline) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }

    return () => {
      stopLocationTracking();
    };
  }, [isOnline]);

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or when moved 10 meters
        },
        (location) => {
          setUserLat(location.coords.latitude);
          setUserLng(location.coords.longitude);
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          // Update route if destination is set
          if (driverDestination) {
            updateRoute(
              { latitude: location.coords.latitude, longitude: location.coords.longitude },
              driverDestination
            );
          }
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  // Update route using OSRM for road-following directions
  const updateRoute = useCallback(async (
    from: { latitude: number; longitude: number }, 
    to: { latitude: number; longitude: number }
  ) => {
    setIsLoadingRoute(true);
    try {
      const result = await getRoute(from, to);
      if (result.coords.length > 0) {
        setRoute(result.coords);
      } else {
        // Fallback to straight line if OSRM fails
        const points = [];
        const steps = 15;
        for (let i = 0; i <= steps; i++) {
          points.push({
            latitude: from.latitude + (to.latitude - from.latitude) * (i / steps),
            longitude: from.longitude + (to.longitude - from.longitude) * (i / steps),
          });
        }
        setRoute(points);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  }, []);

  // Search for destination locations
  const searchDestination = useCallback(async (query: string) => {
    if (query.length < 2) {
      setDestinationSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocationsNominatim(query, userLat, userLng, 8);
      setDestinationSuggestions(results);
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setIsSearching(false);
    }
  }, [userLat, userLng]);

  // Handle destination search input
  const handleDestinationQueryChange = useCallback((text: string) => {
    setDestinationQuery(text);
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchDestination(text);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchDestination]);

  // Handle selecting a destination suggestion
  const handleSelectDestination = useCallback(async (suggestion: LocationSuggestion) => {
    const destination = {
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      address: suggestion.name || suggestion.address,
    };
    
    setDriverDestination(destination);
    setShowDestinationSearch(false);
    setDestinationQuery('');
    setDestinationSuggestions([]);
    Keyboard.dismiss();
    
    // Update store
    useDriverStore.getState().setDriverDestination(destination);
    
    // Generate route using OSRM
    await updateRoute(
      { latitude: userLat, longitude: userLng },
      destination
    );
  }, [userLat, userLng, updateRoute]);

  function handleToggleOnline(v: boolean) {
    setOnlineStatus(v);
    if (v) {
      Alert.alert(
        'You are now Online',
        'You will start receiving ride requests that match your destination.',
        [{ text: 'OK' }]
      );
    } else {
      setRoute([]);
    }
  }

  function handleSetDestination() {
    setShowDestinationSearch(true);
  }

  function handleClearDestination() {
    setDriverDestination(null);
    setRoute([]);
    setShowDestinationSearch(false);
    setDestinationQuery('');
    setDestinationSuggestions([]);
    useDriverStore.getState().setDriverDestination(null);
  }

  function handleRequestPress(req: any) {
    router.push(`/driver/incoming-request?id=${req.id}`);
  }

  function handleCreateRoute() {
    router.push('/driver/create-route');
  }

  // Build map markers
  const mapMarkers = [
    // Driver destination if set
    ...(driverDestination ? [{
      id: 'destination',
      latitude: driverDestination.latitude,
      longitude: driverDestination.longitude,
      title: driverDestination.address,
      type: 'destination' as const,
    }] : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={userLat}
          longitude={userLng}
          zoom={14}
          markers={mapMarkers}
          showUserLocation={true}
          route={route}
          routeColor={COLORS.primary}
          style={{ flex: 1 }}
        />
      </View>

      {/* Floating header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>
              Hello, {user?.name?.split(' ')[0] || 'Driver'}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, isOnline ? styles.statusOnline : styles.statusOffline]} />
              <Text style={styles.subtitle}>
                {isOnline ? 'Online - Tracking' : 'Offline'}
              </Text>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>{isOnline ? 'Online' : 'Offline'}</Text>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>
      </View>

      {/* Dashboard / bottom sheet */}
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardHeader}>
          <View>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
            <Text style={styles.dashboardSubtitle}>Your earnings & stats</Text>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push('/driver/profile')}
            accessibilityLabel="Open Profile"
          >
            <Icon name="user" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="navigation" size={20} color={COLORS.primary} style={styles.statIcon} />
            <Text style={styles.statValue}>{tripStats.todayTrips}</Text>
            <Text style={styles.statLabel}>Today's Trips</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="credit-card" size={20} color={COLORS.success} style={styles.statIcon} />
            <Text style={styles.statValueGreen}>₦{tripStats.todayEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
        </View>

        {/* Total Stats Row */}
        <View style={styles.totalStatsRow}>
          <View style={styles.totalStat}>
            <Text style={styles.totalLabel}>Total Trips</Text>
            <Text style={styles.totalValue}>{tripStats.totalTrips}</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalStat}>
            <Text style={styles.totalLabel}>Total Earnings</Text>
            <Text style={styles.totalValueGreen}>₦{tripStats.totalEarnings.toLocaleString()}</Text>
          </View>
        </View>

        {/* Destination Section */}
        <View style={styles.destinationSection}>
          <Text style={styles.sectionTitle}>Your Destination</Text>
          
          {showDestinationSearch ? (
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Icon name="search" size={18} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for destination..."
                  placeholderTextColor={COLORS.textTertiary}
                  value={destinationQuery}
                  onChangeText={handleDestinationQueryChange}
                  autoFocus
                />
                {isSearching && <ActivityIndicator size="small" color={COLORS.primary} />}
                <TouchableOpacity onPress={() => setShowDestinationSearch(false)}>
                  <Icon name="x" size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              
              {destinationSuggestions.length > 0 && (
                <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled">
                  {destinationSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectDestination(suggestion)}
                    >
                      <Icon name="map-pin" size={16} color={COLORS.primary} />
                      <View style={styles.suggestionTextContainer}>
                        <Text style={styles.suggestionTitle} numberOfLines={1}>
                          {suggestion.name}
                        </Text>
                        <Text style={styles.suggestionAddress} numberOfLines={1}>
                          {suggestion.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ) : driverDestination ? (
            <View style={styles.destinationCard}>
              <View style={styles.destinationInfo}>
                <Icon name="flag" size={18} color={COLORS.primary} />
                <Text style={styles.destinationText} numberOfLines={2}>{driverDestination.address}</Text>
              </View>
              {isLoadingRoute ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <TouchableOpacity onPress={handleClearDestination} style={styles.clearBtn}>
                  <Icon name="x" size={18} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity style={styles.setDestinationBtn} onPress={handleSetDestination}>
              <Icon name="map-pin" size={18} color={COLORS.white} />
              <Text style={styles.setDestinationText}>Set Your Destination</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pending Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ride Requests ({pendingRequests.length})
          </Text>

          {pendingRequests.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="inbox" size={32} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>
                {isOnline
                  ? driverDestination 
                    ? 'Waiting for matching ride requests...'
                    : 'Set a destination to receive matching requests'
                  : 'Go online to receive ride requests'}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
              {pendingRequests.map((request: any) => (
                <TouchableOpacity
                  key={request.id}
                  style={styles.requestCard}
                  onPress={() => handleRequestPress(request)}
                >
                  <View style={styles.requestLeft}>
                    <Icon name="map-pin" size={18} color={COLORS.primary} />
                  </View>

                  <View style={styles.requestBody}>
                    <Text style={styles.requestTitle}>{request.pickup || 'Pickup Location'}</Text>
                    <Text style={styles.requestMeta}>
                      {request.distance ? `${request.distance} km` : ''} · {request.eta || '5 min'}
                    </Text>
                  </View>

                  <View style={styles.requestFare}>
                    <Text style={styles.fareText}>₦{request.fare?.toLocaleString() || '1,500'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  mapContainer: {
    height: height * 0.45,
  },

  header: {
    position: 'absolute',
    top: SPACING.xl + 40, // Account for SafeAreaView
    left: SPACING.md,
    right: SPACING.md,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOW.md,
  },

  greetingWrap: {
    flex: 1,
  },

  greeting: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusOnline: {
    backgroundColor: COLORS.success,
  },

  statusOffline: {
    backgroundColor: COLORS.textTertiary,
  },

  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  toggleContainer: {
    alignItems: 'center',
    marginLeft: SPACING.md,
  },

  toggleLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontWeight: FONT_WEIGHT.medium,
  },

  dashboardContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    marginTop: -24,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOW.md,
  },

  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  dashboardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  dashboardSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  profileBtn: {
    padding: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
  },

  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statIcon: {
    marginBottom: SPACING.xs,
  },

  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.primary,
    marginBottom: 2,
  },

  statValueGreen: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.success,
    marginBottom: 2,
  },

  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  totalStatsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },

  totalStat: {
    flex: 1,
    alignItems: 'center',
  },

  totalDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },

  totalLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },

  totalValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.textPrimary,
  },

  totalValueGreen: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.success,
  },

  destinationSection: {
    marginBottom: SPACING.md,
  },

  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  destinationInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  destinationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.medium,
  },

  clearBtn: {
    padding: SPACING.xs,
  },

  setDestinationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },

  setDestinationText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },

  searchContainer: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
  },

  suggestionsContainer: {
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },

  suggestionTextContainer: {
    flex: 1,
  },

  suggestionTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.textPrimary,
  },

  suggestionAddress: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  section: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },

  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },

  requestsList: {
    maxHeight: 120,
  },

  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  requestLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  requestBody: {
    flex: 1,
    paddingLeft: SPACING.sm,
  },

  requestTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.textPrimary,
  },

  requestMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  requestFare: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },

  fareText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});
