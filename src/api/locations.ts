// src/api/locations.ts
// Location API service for geocoding and meeting points
import { pythonAxiosInstance } from './axiosInstance';
import { NOMINATIM_BASE_URL, LOCATION_ENDPOINTS } from './endpoints';
import { MeetingPoint, ApiResponse } from '../types/api';

// ===========================================
// Types
// ===========================================
export interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type?: string;
  distance?: number;
}

export interface ReverseGeocodeResult {
  address: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

// ===========================================
// Nominatim Geocoding (Free, no API key)
// ===========================================

/**
 * Search for locations using Nominatim (OpenStreetMap)
 * This is a free geocoding service with no API key required
 * Rate limit: 1 request per second
 */
export async function searchLocationsNominatim(
  query: string,
  lat?: number,
  lng?: number,
  limit: number = 10
): Promise<LocationSuggestion[]> {
  try {
    const params: Record<string, string | number> = {
      q: query,
      format: 'json',
      addressdetails: 1,
      limit,
      countrycodes: 'ng', // Limit to Nigeria
    };

    // If user location provided, bias results towards it
    if (lat && lng) {
      params.viewbox = `${lng - 0.5},${lat + 0.5},${lng + 0.5},${lat - 0.5}`;
      params.bounded = 0; // Don't strictly limit to viewbox
    }

    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?${new URLSearchParams(params as any)}`,
      {
        headers: {
          'User-Agent': 'OpenRide-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    return data.map((item: any, index: number) => ({
      id: item.place_id?.toString() || `loc_${index}`,
      name: item.display_name.split(',')[0],
      address: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
    }));
  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocodeNominatim(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'OpenRide-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding request failed');
    }

    const data = await response.json();

    return {
      address: data.display_name,
      street: data.address?.road || data.address?.street,
      city: data.address?.city || data.address?.town || data.address?.village,
      state: data.address?.state,
      country: data.address?.country,
      postcode: data.address?.postcode,
    };
  } catch (error) {
    console.error('Reverse geocode error:', error);
    return null;
  }
}

// ===========================================
// Backend API Integration
// ===========================================

/**
 * Search locations using backend API (Python search service)
 * Backend can use Google Places API or other providers
 */
export async function searchLocationsAPI(
  query: string,
  lat?: number,
  lng?: number
): Promise<LocationSuggestion[]> {
  try {
    const response = await pythonAxiosInstance.get<ApiResponse<{ results: LocationSuggestion[] }>>(
      LOCATION_ENDPOINTS.SEARCH_LOCATIONS, 
      {
        params: { query, lat, lng },
      }
    );
    return response.data.data.results;
  } catch (error) {
    console.error('Location search API error:', error);
    // Fallback to Nominatim if backend fails
    return searchLocationsNominatim(query, lat, lng);
  }
}

/**
 * Reverse geocode using backend API (Python search service)
 */
export async function reverseGeocodeAPI(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResult | null> {
  try {
    const response = await pythonAxiosInstance.get<ApiResponse<ReverseGeocodeResult>>(
      LOCATION_ENDPOINTS.REVERSE_GEOCODE, 
      {
        params: { lat, lng },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Reverse geocode API error:', error);
    // Fallback to Nominatim
    return reverseGeocodeNominatim(lat, lng);
  }
}

/**
 * Get meeting points from backend API (Python search service)
 * Backend finds optimal meeting points based on user location and destination
 */
export async function getMeetingPointsAPI(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number
): Promise<MeetingPoint[]> {
  try {
    const response = await pythonAxiosInstance.get<ApiResponse<{ meetingPoints: MeetingPoint[] }>>(
      LOCATION_ENDPOINTS.GET_MEETING_POINTS, 
      {
        params: {
          lat: userLat,
          lng: userLng,
          destLat,
          destLng,
        },
      }
    );
    return response.data.data.meetingPoints;
  } catch (error) {
    console.error('Meeting points API error:', error);
    // Return empty array, frontend will use local fallback
    return [];
  }
}

/**
 * Get popular/frequently used locations (Python search service)
 */
export async function getPopularLocationsAPI(
  lat: number,
  lng: number
): Promise<LocationSuggestion[]> {
  try {
    const response = await pythonAxiosInstance.get<ApiResponse<{ locations: LocationSuggestion[] }>>(
      LOCATION_ENDPOINTS.GET_POPULAR_LOCATIONS, 
      {
        params: { lat, lng },
      }
    );
    return response.data.data.locations;
  } catch (error) {
    console.error('Popular locations API error:', error);
    return [];
  }
}

// ===========================================
// Unified Search Function
// ===========================================

/**
 * Search for locations - tries backend first, falls back to Nominatim
 */
export async function searchLocations(
  query: string,
  userLat?: number,
  userLng?: number,
  useBackend: boolean = true
): Promise<LocationSuggestion[]> {
  if (useBackend) {
    try {
      return await searchLocationsAPI(query, userLat, userLng);
    } catch {
      // Fall through to Nominatim
    }
  }
  return searchLocationsNominatim(query, userLat, userLng);
}

/**
 * Reverse geocode - tries backend first, falls back to Nominatim
 */
export async function reverseGeocode(
  lat: number,
  lng: number,
  useBackend: boolean = true
): Promise<ReverseGeocodeResult | null> {
  if (useBackend) {
    try {
      return await reverseGeocodeAPI(lat, lng);
    } catch {
      // Fall through to Nominatim
    }
  }
  return reverseGeocodeNominatim(lat, lng);
}
