// src/components/ride/MeetingPointPicker.tsx
// Component to display and select meeting points for pickup

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, RADIUS, SHADOW } from '@/constants';
import {
  MeetingPoint,
  findNearbyMeetingPoints,
  findMeetingPointsBetween,
  formatDistance,
  getMeetingPointIcon,
  getMeetingPointColor,
} from '@/services/meetingPoints';

interface MeetingPointPickerProps {
  userLocation: { latitude: number; longitude: number };
  driverLocation?: { latitude: number; longitude: number };
  onSelectPoint: (point: MeetingPoint) => void;
  selectedPointId?: string;
  maxWalkingDistance?: number; // in meters
  title?: string;
}

export function MeetingPointPicker({
  userLocation,
  driverLocation,
  onSelectPoint,
  selectedPointId,
  maxWalkingDistance = 800,
  title = 'Suggested Pickup Points',
}: MeetingPointPickerProps) {
  const [meetingPoints, setMeetingPoints] = useState<MeetingPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let points: MeetingPoint[];
      
      if (driverLocation) {
        // Find points between user and driver
        points = findMeetingPointsBetween(
          userLocation.latitude,
          userLocation.longitude,
          driverLocation.latitude,
          driverLocation.longitude,
          maxWalkingDistance
        );
      } else {
        // Find points near user
        points = findNearbyMeetingPoints(
          userLocation.latitude,
          userLocation.longitude,
          maxWalkingDistance,
          5
        );
      }
      
      setMeetingPoints(points);
      setLoading(false);
    }, 500);
  }, [userLocation, driverLocation, maxWalkingDistance]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Finding nearby pickup points...</Text>
      </View>
    );
  }

  if (meetingPoints.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="location-outline" size={32} color={COLORS.textTertiary} />
        <Text style={styles.emptyText}>No pickup points found nearby</Text>
        <Text style={styles.emptySubtext}>Try expanding your search area</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="navigate-circle" size={20} color={COLORS.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {meetingPoints.map((point) => {
          const isSelected = selectedPointId === point.id;
          const iconName = getMeetingPointIcon(point.type);
          const iconColor = getMeetingPointColor(point.type);
          
          return (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.pointCard,
                isSelected && styles.pointCardSelected,
              ]}
              onPress={() => onSelectPoint(point)}
              activeOpacity={0.7}
            >
              {/* Type Badge */}
              <View style={[styles.typeBadge, { backgroundColor: iconColor + '20' }]}>
                <Ionicons name={iconName as any} size={16} color={iconColor} />
              </View>
              
              {/* Point Name */}
              <Text style={styles.pointName} numberOfLines={2}>
                {point.name}
              </Text>
              
              {/* Distance & Walking Time */}
              <View style={styles.pointMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="walk-outline" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>
                    {point.walkingTime} min
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="navigate-outline" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.metaText}>
                    {formatDistance(point.distanceFromUser || 0)}
                  </Text>
                </View>
              </View>

              {/* Selected Indicator */}
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Text style={styles.helperText}>
        <Ionicons name="information-circle-outline" size={12} color={COLORS.textTertiary} />
        {' '}Meet your driver at a convenient location along their route
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  pointCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    ...SHADOW.sm,
  },
  pointCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '08',
  },
  typeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pointName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  pointMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    gap: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textTertiary,
  },
  helperText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
});

export default MeetingPointPicker;
