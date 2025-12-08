import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ViewToken, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SlideData {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    iconName: 'wallet-outline',
    title: 'Affordable Rides',
    description: 'No surge pricing. Fair rates. Pay what you expect, every single time.',
  },
  {
    id: '2',
    iconName: 'location-outline',
    title: 'Live GPS Tracking',
    description: 'Know exactly where your driver is. Share your trip with family and friends.',
  },
  {
    id: '3',
    iconName: 'shield-checkmark-outline',
    title: 'Safe & Secure',
    description: 'Every driver is background-checked and verified for your peace of mind.',
  },
];

interface SlideItemProps {
  item: SlideData;
}

const SlideItem: React.FC<SlideItemProps> = ({ item }) => (
  <View style={styles.slide}>
    <Animated.View entering={FadeInDown.duration(600)} style={styles.slideContent}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.iconName} size={80} color={COLORS.primary} />
      </View>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideDescription}>{item.description}</Text>
    </Animated.View>
  </View>
);

export default function CarouselScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/auth/test-login');
    }
  };

  const handleSkip = () => {
    router.push('/auth/test-login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <SlideItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    alignItems: 'flex-end',
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  slideContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  slideTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slideDescription: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray200,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
});
