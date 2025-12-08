import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from "@/constants";
import { useRouter } from "expo-router";
import { OpenStreetMap } from "@/components/map/OpenStreetMap";
import { useRiderStore } from "@/store/riderStore";
import { getRoute } from "@/utils/getRoute";
import { searchLocationsNominatim, LocationSuggestion } from "@/api/locations";
import {
  MeetingPoint,
  findSmartMeetingPoints,
  findNearbyMeetingPoints,
  formatDistance,
  getMeetingPointIcon,
  getMeetingPointColor,
} from "@/services/meetingPoints";

const { width, height } = Dimensions.get("window");

// Default location (Lagos, Nigeria)
const DEFAULT_LAT = 6.5244;
const DEFAULT_LNG = 3.3792;

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate travel time based on distance (avg 30 km/h in Lagos traffic)
function estimateTravelTime(distanceKm: number): number {
  const avgSpeedKmH = 30;
  return Math.ceil((distanceKm / avgSpeedKmH) * 60); // minutes
}

export default function RiderHome() {
  const router = useRouter();
  const { setPickup, setDestination } = useRiderStore();

  const [userLat, setUserLat] = useState(DEFAULT_LAT);
  const [userLng, setUserLng] = useState(DEFAULT_LNG);
  const [locationLoaded, setLocationLoaded] = useState(false);

  // Address states
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickupLocation, setPickupLocation] = useState<LocationSuggestion | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<LocationSuggestion | null>(null);

  // UI states
  const [activeInput, setActiveInput] = useState<"pickup" | "destination" | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Trip info
  const [tripDistance, setTripDistance] = useState<number | null>(null);
  const [tripDuration, setTripDuration] = useState<number | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{latitude: number; longitude: number}[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Meeting points state
  const [showMeetingPoints, setShowMeetingPoints] = useState(false);
  const [nearbyMeetingPoints, setNearbyMeetingPoints] = useState<MeetingPoint[]>([]);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState<MeetingPoint | null>(null);
  const [isLoadingMeetingPoints, setIsLoadingMeetingPoints] = useState(false);

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationLoaded(true);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);

        // Reverse geocode to get address
        const addresses = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (addresses.length > 0) {
          const addr = addresses[0];
          const formattedAddress = [addr.street, addr.district, addr.city]
            .filter(Boolean)
            .join(", ");
          setPickupAddress(formattedAddress || "Current Location");
          setPickupLocation({
            id: "current",
            name: "Current Location",
            address: formattedAddress || "Current Location",
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (e) {
        console.log("Using default location");
        setPickupAddress("Lagos, Nigeria");
      }
      setLocationLoaded(true);
    })();
  }, []);

  // Search for location suggestions using Nominatim
  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocationsNominatim(query, userLat, userLng, 8);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, [userLat, userLng]);

  // Handle input change with debounce
  const handleInputChange = (text: string, type: "pickup" | "destination") => {
    if (type === "pickup") {
      setPickupAddress(text);
      setPickupLocation(null);
    } else {
      setDestinationAddress(text);
      setDestinationLocation(null);
    }
    // Debounce the search
    const timeoutId = setTimeout(() => {
      searchLocations(text);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    if (activeInput === "pickup") {
      setPickupAddress(suggestion.address);
      setPickupLocation(suggestion);
      setSelectedMeetingPoint(null); // Reset meeting point when pickup changes
    } else {
      setDestinationAddress(suggestion.address);
      setDestinationLocation(suggestion);
      // Show meeting points picker when destination is selected
      setShowMeetingPoints(true);
      setIsLoadingMeetingPoints(true);
    }
    setSuggestions([]);
    setActiveInput(null);
    Keyboard.dismiss();
  };

  // Handle meeting point selection
  const handleSelectMeetingPoint = (point: MeetingPoint) => {
    setSelectedMeetingPoint(point);
    // Update pickup to the meeting point
    setPickupAddress(point.name);
    setPickupLocation({
      id: point.id,
      name: point.name,
      address: point.address || point.name,
      latitude: point.latitude,
      longitude: point.longitude,
    });
    setShowMeetingPoints(false);
  };

  // Load meeting points when destination is set (use user's current location)
  useEffect(() => {
    if (destinationLocation && locationLoaded) {
      console.log('Loading meeting points from user location:', userLat, userLng, 'to destination:', destinationLocation.latitude, destinationLocation.longitude);
      
      // Try to find smart meeting points along the route
      let points = findSmartMeetingPoints(
        userLat,
        userLng,
        destinationLocation.latitude,
        destinationLocation.longitude,
        3000, // 3km max walking
        2000  // 2km corridor
      );
      
      // If no points found, fall back to finding any nearby points
      if (points.length === 0) {
        console.log('No smart points found, falling back to nearby search');
        points = findNearbyMeetingPoints(userLat, userLng, 5000, 10);
      }
      
      console.log('Found meeting points:', points.length);
      setNearbyMeetingPoints(points);
      setIsLoadingMeetingPoints(false);
    }
  }, [destinationLocation, locationLoaded, userLat, userLng]);

  // Calculate trip info and get route when both locations are set
  useEffect(() => {
    if (pickupLocation && destinationLocation) {
      // Fetch actual road route from OSRM
      setIsLoadingRoute(true);
      getRoute(
        { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
        { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude }
      )
        .then((result) => {
          if (result.coords.length > 0) {
            setRouteCoordinates(result.coords);
            setTripDistance(result.distance);
            setTripDuration(Math.ceil(result.duration));
            // Base fare: ₦500 + ₦150/km
            const fare = Math.round(500 + result.distance * 150);
            setEstimatedFare(fare);
          } else {
            // Fallback to straight-line calculation if routing fails
            const distance = calculateDistance(
              pickupLocation.latitude,
              pickupLocation.longitude,
              destinationLocation.latitude,
              destinationLocation.longitude
            );
            const duration = estimateTravelTime(distance);
            const fare = Math.round(500 + distance * 150);
            
            setRouteCoordinates([
              { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
              { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude },
            ]);
            setTripDistance(distance);
            setTripDuration(duration);
            setEstimatedFare(fare);
          }
        })
        .catch((error) => {
          console.error('Error fetching route:', error);
          // Fallback to straight-line calculation
          const distance = calculateDistance(
            pickupLocation.latitude,
            pickupLocation.longitude,
            destinationLocation.latitude,
            destinationLocation.longitude
          );
          setRouteCoordinates([
            { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
            { latitude: destinationLocation.latitude, longitude: destinationLocation.longitude },
          ]);
          setTripDistance(distance);
          setTripDuration(estimateTravelTime(distance));
          setEstimatedFare(Math.round(500 + distance * 150));
        })
        .finally(() => {
          setIsLoadingRoute(false);
        });

      // Update store
      setPickup({
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
        address: pickupLocation.address,
      });
      setDestination({
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
        address: destinationLocation.address,
      });
    } else {
      setTripDistance(null);
      setTripDuration(null);
      setEstimatedFare(null);
      setRouteCoordinates([]);
    }
  }, [pickupLocation, destinationLocation]);

  // Mock drivers near user location
  const mockDrivers = [
    { id: 1, latitude: userLat + 0.002, longitude: userLng + 0.001, title: "Driver 1", type: "driver" as const },
    { id: 2, latitude: userLat - 0.001, longitude: userLng + 0.002, title: "Driver 2", type: "driver" as const },
    { id: 3, latitude: userLat + 0.001, longitude: userLng - 0.002, title: "Driver 3", type: "driver" as const },
  ];

  // Build map markers
  const mapMarkers = [
    ...mockDrivers,
    // Show selected meeting point on map
    ...(selectedMeetingPoint
      ? [
          {
            id: "meetingpoint",
            latitude: selectedMeetingPoint.latitude,
            longitude: selectedMeetingPoint.longitude,
            title: selectedMeetingPoint.name,
            type: "pickup" as const,
          },
        ]
      : []),
    ...(destinationLocation
      ? [
          {
            id: "destination",
            latitude: destinationLocation.latitude,
            longitude: destinationLocation.longitude,
            title: destinationLocation.name,
            type: "destination" as const,
          },
        ]
      : []),
  ];

  // Build route for map - use actual road coordinates from OSRM
  const mapRoute = routeCoordinates;

  // Can only request ride after selecting a meeting point
  const canRequestRide = pickupLocation && destinationLocation && selectedMeetingPoint;

  const handleRequestRide = () => {
    if (!canRequestRide) return;
    // Update pickup location with meeting point info before navigating
    setPickup({
      latitude: selectedMeetingPoint.latitude,
      longitude: selectedMeetingPoint.longitude,
      address: selectedMeetingPoint.name,
    });
    // Navigate to searching screen
    router.push("/rider/searching");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <OpenStreetMap
          latitude={userLat}
          longitude={userLng}
          zoom={destinationLocation ? 13 : 15}
          markers={mapMarkers}
          showUserLocation={true}
          route={mapRoute}
          routeColor={COLORS.primary}
          style={{ flex: 1 }}
        />
      </View>

      {/* Location Input Card */}
      <View style={styles.inputCard}>
        {/* Pickup Input */}
        <View style={styles.inputRow}>
          <View style={styles.iconContainer}>
            <View style={styles.pickupDot} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Pickup</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter pickup location"
              placeholderTextColor={COLORS.textTertiary}
              value={pickupAddress}
              onChangeText={(text) => handleInputChange(text, "pickup")}
              onFocus={() => setActiveInput("pickup")}
            />
          </View>
          {pickupLocation && (
            <TouchableOpacity onPress={() => { setPickupAddress(""); setPickupLocation(null); }}>
              <Ionicons name="close-circle" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Divider with line */}
        <View style={styles.dividerContainer}>
          <View style={styles.verticalLine} />
        </View>

        {/* Destination Input */}
        <View style={styles.inputRow}>
          <View style={styles.iconContainer}>
            <View style={styles.destinationSquare} />
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Where are you going?"
              placeholderTextColor={COLORS.textTertiary}
              value={destinationAddress}
              onChangeText={(text) => handleInputChange(text, "destination")}
              onFocus={() => setActiveInput("destination")}
            />
          </View>
          {destinationLocation && (
            <TouchableOpacity onPress={() => { setDestinationAddress(""); setDestinationLocation(null); }}>
              <Ionicons name="close-circle" size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions Dropdown */}
        {activeInput && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="handled">
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion.id}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectSuggestion(suggestion)}
                >
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                  <View style={styles.suggestionText}>
                    <Text style={styles.suggestionName}>{suggestion.name}</Text>
                    <Text style={styles.suggestionAddress}>{suggestion.address}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {isSearching && (
          <View style={styles.searchingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        )}
      </View>

      {/* Trip Info Card (shown when both locations are set) */}
      {pickupLocation && destinationLocation && (
        <View style={styles.tripInfoCard}>
          {isLoadingRoute ? (
            <View style={styles.tripInfoLoading}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.tripInfoLoadingText}>Calculating route...</Text>
            </View>
          ) : tripDistance !== null && tripDuration !== null && estimatedFare !== null ? (
            <View style={styles.tripInfoRow}>
              <View style={styles.tripInfoItem}>
                <Ionicons name="navigate-outline" size={20} color={COLORS.primary} />
                <Text style={styles.tripInfoValue}>{tripDistance.toFixed(1)} km</Text>
                <Text style={styles.tripInfoLabel}>Distance</Text>
              </View>
              <View style={styles.tripInfoDivider} />
              <View style={styles.tripInfoItem}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.tripInfoValue}>{tripDuration} min</Text>
                <Text style={styles.tripInfoLabel}>Duration</Text>
              </View>
              <View style={styles.tripInfoDivider} />
              <View style={styles.tripInfoItem}>
                <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
                <Text style={styles.tripInfoValue}>₦{estimatedFare.toLocaleString()}</Text>
                <Text style={styles.tripInfoLabel}>Est. Fare</Text>
              </View>
            </View>
          ) : null}
        </View>
      )}

      {/* Meeting Points Picker (shown after destination is selected) */}
      {showMeetingPoints && destinationLocation && (
        <View style={styles.meetingPointsContainer}>
          <View style={styles.meetingPointsHeader}>
            <View style={styles.meetingPointsTitle}>
              <Ionicons name="git-branch-outline" size={20} color={COLORS.primary} />
              <Text style={styles.meetingPointsTitleText}>Choose Pickup Point</Text>
            </View>
            <TouchableOpacity onPress={() => setShowMeetingPoints(false)}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.meetingPointsSubtitle}>
            Select a bus stop or junction where you'll meet your driver
          </Text>
          {isLoadingMeetingPoints ? (
            <View style={styles.noMeetingPointsContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.noMeetingPointsText}>Finding pickup points...</Text>
            </View>
          ) : nearbyMeetingPoints.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.meetingPointsScroll}
            >
              {nearbyMeetingPoints.map((point) => {
                const iconName = getMeetingPointIcon(point.type);
                const iconColor = getMeetingPointColor(point.type);
                const isSelected = selectedMeetingPoint?.id === point.id;
                
                return (
                  <TouchableOpacity
                    key={point.id}
                    style={[
                      styles.meetingPointCard,
                      isSelected && styles.meetingPointCardSelected,
                      point.isOnRoute && styles.meetingPointCardOnRoute,
                    ]}
                    onPress={() => handleSelectMeetingPoint(point)}
                    activeOpacity={0.7}
                  >
                    {/* On Route Badge */}
                    {point.isOnRoute && (
                      <View style={styles.onRouteBadge}>
                        <Text style={styles.onRouteBadgeText}>On Route</Text>
                      </View>
                    )}
                    <View style={[styles.meetingPointIcon, { backgroundColor: iconColor + '20' }]}>
                      <Ionicons name={iconName as any} size={18} color={iconColor} />
                    </View>
                    <Text style={styles.meetingPointName} numberOfLines={2}>
                      {point.name}
                    </Text>
                    <View style={styles.meetingPointMeta}>
                      <View style={styles.metaRow}>
                        <Ionicons name="walk-outline" size={12} color={COLORS.textSecondary} />
                        <Text style={styles.meetingPointMetaText}>
                          {point.walkingTime} min
                        </Text>
                      </View>
                      <Text style={styles.meetingPointDistance}>
                        {formatDistance(point.distanceFromUser || 0)}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.meetingPointCheck}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.noMeetingPointsContainer}>
              <Ionicons name="location-outline" size={24} color={COLORS.textSecondary} />
              <Text style={styles.noMeetingPointsText}>No pickup points found nearby</Text>
            </View>
          )}
        </View>
      )}

      {/* Selected Meeting Point Display (when picker is closed but point is selected) */}
      {selectedMeetingPoint && !showMeetingPoints && destinationLocation && (
        <TouchableOpacity 
          style={styles.selectedMeetingPointBanner}
          onPress={() => setShowMeetingPoints(true)}
        >
          <View style={styles.selectedMeetingPointInfo}>
            <Ionicons name="location" size={20} color={COLORS.success} />
            <View>
              <Text style={styles.selectedMeetingPointLabel}>Pickup Point</Text>
              <Text style={styles.selectedMeetingPointName}>{selectedMeetingPoint.name}</Text>
            </View>
          </View>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      )}

      {/* Request Ride Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.rideBtn, !canRequestRide && styles.rideBtnDisabled]}
          onPress={handleRequestRide}
          disabled={!canRequestRide}
          activeOpacity={0.8}
        >
          <Text style={[styles.rideBtnText, !canRequestRide && { color: COLORS.textTertiary }]}>
            {!destinationLocation 
              ? "Enter destination to continue"
              : !selectedMeetingPoint 
                ? "Select a pickup point"
                : "Request a Ride"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },

  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },

  inputCard: {
    position: "absolute",
    top: 60,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },

  iconContainer: {
    width: 24,
    alignItems: "center",
    marginRight: SPACING.sm,
  },

  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
  },

  destinationSquare: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  dividerContainer: {
    paddingLeft: 12,
    height: 20,
  },

  verticalLine: {
    width: 2,
    height: "100%",
    backgroundColor: COLORS.gray200,
    marginLeft: 5,
  },

  inputWrapper: {
    flex: 1,
  },

  inputLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    marginBottom: 2,
  },

  textInput: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    padding: 0,
    fontWeight: "500",
  },

  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
  },

  suggestionsList: {
    maxHeight: 200,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },

  suggestionText: {
    flex: 1,
  },

  suggestionName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  suggestionAddress: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },

  searchingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  tripInfoCard: {
    position: "absolute",
    bottom: 85,
    left: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 5,
  },

  tripInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  tripInfoItem: {
    alignItems: "center",
    flex: 1,
  },

  tripInfoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },

  tripInfoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  tripInfoDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray200,
  },

  tripInfoLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },

  tripInfoLoadingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    zIndex: 20,
  },

  rideBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: "center",
  },

  rideBtnDisabled: {
    backgroundColor: COLORS.gray200,
  },

  rideBtnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: FONT_SIZE.md,
  },

  // Meeting Points Styles
  meetingPointsContainer: {
    position: "absolute",
    bottom: 85,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 15,
  },

  meetingPointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xs,
  },

  meetingPointsTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },

  meetingPointsTitleText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  meetingPointsSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },

  meetingPointsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },

  meetingPointCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
    marginTop: 8,
    position: 'relative',
    minHeight: 130,
  },

  meetingPointCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '08',
  },

  meetingPointCardOnRoute: {
    borderColor: '#10B981',
    borderWidth: 1.5,
  },

  onRouteBadge: {
    position: 'absolute',
    top: -8,
    left: SPACING.sm,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },

  onRouteBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '700',
  },

  meetingPointIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  meetingPointName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
    minHeight: 36,
  },

  meetingPointMeta: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    marginTop: 'auto',
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  meetingPointMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  meetingPointDistance: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 16,
  },

  meetingPointCheck: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
  },

  noMeetingPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },

  noMeetingPointsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },

  // Selected meeting point banner (when picker is closed)
  selectedMeetingPointBanner: {
    position: 'absolute',
    bottom: 175,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.success + '12',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.success,
    zIndex: 15,
  },

  selectedMeetingPointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  selectedMeetingPointLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },

  selectedMeetingPointName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  changeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
