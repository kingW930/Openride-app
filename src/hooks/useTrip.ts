import { useEffect } from 'react';
import { useTripStore } from '../store/tripStore';
import { socketService } from '../services/socket';
import { useAuth } from './useAuth';

export const useTrip = () => {
  const { user } = useAuth();
  const { activeTrip, driverLocation, setActiveTrip, setDriverLocation } = useTripStore();

  useEffect(() => {
    if (!activeTrip) return;

    // Subscribe to trip updates
    socketService.on('trip:update', (data) => {
      setActiveTrip(data);
    });

    // Subscribe to driver location updates (for riders)
    if (user?.role === 'rider') {
      socketService.on('driver:location', (location) => {
        setDriverLocation(location);
      });
      
      // Subscribe to driver channel
      socketService.emit('rider:subscribe', { tripId: activeTrip.id });
    }

    return () => {
      socketService.off('trip:update');
      socketService.off('driver:location');
    };
  }, [activeTrip, user?.role]);

  return {
    activeTrip,
    driverLocation,
    setActiveTrip,
  };
};
