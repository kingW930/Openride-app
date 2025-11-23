export const MAP_CONFIG = {
  // Default map region (Lagos, Nigeria)
  DEFAULT_REGION: {
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  
  // Location tracking
  LOCATION_UPDATE_INTERVAL: 5000, // 5 seconds
  LOCATION_DISTANCE_FILTER: 10, // 10 meters
  
  // Map animation
  ANIMATION_DURATION: 300,
  
  // Marker clustering
  CLUSTER_RADIUS: 50,
  MIN_ZOOM_LEVEL: 10,
  
  // Route polyline
  POLYLINE_WIDTH: 4,
  POLYLINE_COLOR: '#007AFF',
};

export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
