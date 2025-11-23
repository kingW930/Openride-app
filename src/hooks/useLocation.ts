import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { locationService } from '../services/location';

export const useLocation = (trackInBackground = false) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const setupLocation = async () => {
      try {
        const hasPermission = await locationService.requestPermissions();
        
        if (!hasPermission) {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await locationService.getCurrentLocation();
        setLocation(currentLocation);
        setLoading(false);

        // Start watching location if needed
        if (trackInBackground) {
          subscription = await locationService.watchLocation((newLocation) => {
            setLocation(newLocation);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get location');
        setLoading(false);
      }
    };

    setupLocation();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [trackInBackground]);

  return { location, error, loading };
};
