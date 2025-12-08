// src/utils/getRoute.ts
// Uses OSRM (Open Source Routing Machine) for free road-based routing

interface Coords {
  latitude: number;
  longitude: number;
}

interface RouteResult {
  coords: Coords[];
  distance: number; // in kilometers
  duration: number; // in minutes
  eta: string | null;
}

// OSRM Demo server (free, no API key required)
// For production, consider self-hosting OSRM or using a paid service
const OSRM_BASE_URL = 'https://router.project-osrm.org';

export async function getRoute(start: Coords, end: Coords): Promise<RouteResult> {
  try {
    // OSRM expects coordinates as lng,lat (not lat,lng)
    const url = `${OSRM_BASE_URL}/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=polyline`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.code !== 'Ok' || !json.routes || json.routes.length === 0) {
      console.warn('OSRM routing failed:', json.message || 'No route found');
      return { coords: [], distance: 0, duration: 0, eta: null };
    }

    const route = json.routes[0];
    const encodedPolyline = route.geometry;
    
    if (!encodedPolyline) {
      return { coords: [], distance: 0, duration: 0, eta: null };
    }

    // Decode the polyline to get road-following coordinates
    const coords = decodePolyline(encodedPolyline);
    
    // Distance in kilometers (OSRM returns meters)
    const distance = route.distance / 1000;
    
    // Duration in minutes (OSRM returns seconds)
    const duration = route.duration / 60;
    
    // Format ETA
    const eta = formatDuration(duration);

    return { coords, distance, duration, eta };
  } catch (error) {
    console.error('Error fetching route:', error);
    return { coords: [], distance: 0, duration: 0, eta: null };
  }
}

// Format duration to human readable string
function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min';
  } else if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) {
      return `${hours} hr`;
    }
    return `${hours} hr ${mins} min`;
  }
}

// Polyline decoder for OSRM/Google encoded polylines
function decodePolyline(encoded: string): Coords[] {
  const coords: Coords[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coords.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coords;
}

// Get route with multiple waypoints (for meeting points)
export async function getRouteWithWaypoints(points: Coords[]): Promise<RouteResult> {
  if (points.length < 2) {
    return { coords: [], distance: 0, duration: 0, eta: null };
  }

  try {
    // Build waypoints string for OSRM
    const waypointsStr = points
      .map(p => `${p.longitude},${p.latitude}`)
      .join(';');

    const url = `${OSRM_BASE_URL}/route/v1/driving/${waypointsStr}?overview=full&geometries=polyline`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.code !== 'Ok' || !json.routes || json.routes.length === 0) {
      console.warn('OSRM routing failed:', json.message || 'No route found');
      return { coords: [], distance: 0, duration: 0, eta: null };
    }

    const route = json.routes[0];
    const coords = decodePolyline(route.geometry);
    const distance = route.distance / 1000;
    const duration = route.duration / 60;
    const eta = formatDuration(duration);

    return { coords, distance, duration, eta };
  } catch (error) {
    console.error('Error fetching route with waypoints:', error);
    return { coords: [], distance: 0, duration: 0, eta: null };
  }
}
