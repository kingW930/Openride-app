// src/components/map/OpenStreetMap.tsx
// Free OpenStreetMap using WebView - no API key required!
import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '@/constants';

interface Marker {
  id: string | number;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;
  type?: 'driver' | 'pickup' | 'destination' | 'user';
}

interface RoutePoint {
  latitude: number;
  longitude: number;
}

interface OpenStreetMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  markers?: Marker[];
  style?: any;
  showUserLocation?: boolean;
  route?: RoutePoint[];
  routeColor?: string;
}

export function OpenStreetMap({
  latitude,
  longitude,
  zoom = 14,
  markers = [],
  style,
  showUserLocation = false,
  route = [],
  routeColor = '#FF6B35',
}: OpenStreetMapProps) {
  
  const html = useMemo(() => {
    // SVG icons for markers (no emojis, proper icons)
    const icons = {
      car: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
      pickup: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`,
      destination: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
      user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`,
      flag: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
    };

    const getMarkerIcon = (type?: string) => {
      switch(type) {
        case 'driver':
          return `<div style="display:flex;align-items:center;justify-content:center;background:#FF6B35;color:white;width:32px;height:32px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${icons.car}</div>`;
        case 'pickup':
          return `<div style="display:flex;align-items:center;justify-content:center;background:#10B981;color:white;width:28px;height:28px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${icons.pickup}</div>`;
        case 'destination':
          return `<div style="display:flex;align-items:center;justify-content:center;background:#EF4444;color:white;width:28px;height:28px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${icons.destination}</div>`;
        case 'user':
          return `<div style="display:flex;align-items:center;justify-content:center;background:#3B82F6;color:white;width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${icons.user}</div>`;
        default:
          return `<div style="display:flex;align-items:center;justify-content:center;background:#3B82F6;color:white;width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${icons.pickup}</div>`;
      }
    };

    const markersJS = markers.map(m => `
      var icon${m.id} = L.divIcon({
        html: '${getMarkerIcon(m.type)}',
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      L.marker([${m.latitude}, ${m.longitude}], {icon: icon${m.id}})
        .addTo(map)
        .bindPopup('<b>${m.title || 'Location'}</b>');
    `).join('\n');

    const userLocationJS = showUserLocation ? `
      L.circleMarker([${latitude}, ${longitude}], {
        radius: 10,
        fillColor: '#4285F4',
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map).bindPopup('<b>You are here</b>');
      
      L.circle([${latitude}, ${longitude}], {
        radius: 30,
        fillColor: '#4285F4',
        color: '#4285F4',
        weight: 1,
        opacity: 0.3,
        fillOpacity: 0.15
      }).addTo(map);
    ` : '';

    const routeJS = route.length > 1 ? `
      var routeCoords = [${route.map(p => `[${p.latitude}, ${p.longitude}]`).join(',')}];
      L.polyline(routeCoords, {
        color: '${routeColor}',
        weight: 5,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);
    ` : '';

    // Calculate bounds to fit all points - only when there's a route
    const allPoints = [
      { lat: latitude, lng: longitude },
      ...markers.map(m => ({ lat: m.latitude, lng: m.longitude })),
      ...route.map(r => ({ lat: r.latitude, lng: r.longitude }))
    ];
    
    // Only fit bounds if we have a route (more than 1 point)
    const fitBoundsJS = route.length > 1 ? `
      var bounds = L.latLngBounds([${allPoints.map(p => `[${p.lat}, ${p.lng}]`).join(',')}]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #map { width: 100%; height: 100%; }
          .custom-marker { background: transparent !important; border: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {
            zoomControl: true,
            attributionControl: false
          }).setView([${latitude}, ${longitude}], ${zoom});
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
          
          ${userLocationJS}
          ${markersJS}
          ${routeJS}
          ${fitBoundsJS}
        </script>
      </body>
      </html>
    `;
  }, [latitude, longitude, zoom, markers, showUserLocation, route, routeColor]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
