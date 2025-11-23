import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setAuth, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    setAuth,
    logout,
    isRider: user?.role === 'rider',
    isDriver: user?.role === 'driver',
  };
};
