import axios from 'axios';
import { API_BASE_URL } from '../constants/endpoints';
import { getToken } from '../utils/storage';

// Python services URL (routes, matchmaking, search, analytics)
const PYTHON_API_URL = process.env.EXPO_PUBLIC_PYTHON_URL || 'http://localhost:8000';

/**
 * Main axios instance for Java backend services
 * (auth, users, bookings, payments, payouts, ticketing)
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios instance for Python backend services
 * (routes, matchmaking, search, fleet, analytics)
 */
export const pythonAxiosInstance = axios.create({
  baseURL: PYTHON_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (Java)
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token (Python)
pythonAxiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (Java)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      console.error('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling (Python)
pythonAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could trigger logout
      console.error('Unauthorized - token may be expired');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
