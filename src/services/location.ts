import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { MAP_CONFIG } from '../constants/map';

const LOCATION_TASK_NAME = 'background-location-task';

class LocationService {
  async requestPermissions(): Promise<boolean> {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      return false;
    }

    // Request background permission for drivers
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    return backgroundStatus === 'granted';
  }

  async getCurrentLocation(): Promise<Location.LocationObject> {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  }

  async watchLocation(
    callback: (location: Location.LocationObject) => void
  ): Promise<Location.LocationSubscription> {
    return await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: MAP_CONFIG.LOCATION_UPDATE_INTERVAL,
        distanceInterval: MAP_CONFIG.LOCATION_DISTANCE_FILTER,
      },
      callback
    );
  }

  async startBackgroundLocationUpdates(callback: (location: Location.LocationObject) => void) {
    // Define the background task
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.error('Background location error:', error);
        return;
      }
      if (data) {
        const { locations } = data as { locations: Location.LocationObject[] };
        if (locations.length > 0) {
          callback(locations[0]);
        }
      }
    });

    // Start background location updates
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: MAP_CONFIG.LOCATION_UPDATE_INTERVAL,
      distanceInterval: MAP_CONFIG.LOCATION_DISTANCE_FILTER,
      foregroundService: {
        notificationTitle: 'OpenRide',
        notificationBody: 'Tracking your location for ride sharing',
      },
    });
  }

  async stopBackgroundLocationUpdates() {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  }
}

export const locationService = new LocationService();
