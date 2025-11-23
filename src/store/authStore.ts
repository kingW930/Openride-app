import { create } from 'zustand';
import { User } from '../types/user';
import { getToken, setToken, removeToken } from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  testingMode: boolean;
  login: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  testingMode: true,

  login: (user: User) => {
    set({ user, isAuthenticated: true, testingMode: true });
  },

  updateUser: (updates: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }));
  },

  setAuth: async (token: string, user: User) => {
    await setToken(token);
    set({ token, user, isAuthenticated: true, testingMode: false });
  },

  logout: async () => {
    await removeToken();
    set({ token: null, user: null, isAuthenticated: false, testingMode: false });
  },

  initialize: async () => {
    try {
      const token = await getToken();
      if (token) {
        // TODO: Validate token and fetch user data
        set({ token, isAuthenticated: true, isLoading: false, testingMode: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },
}));
