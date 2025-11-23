import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ViewToken } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { COLORS, GRADIENTS, FONT_SIZE, FONT_WEIGHT, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

interface SlideData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const slides: SlideData[] = [
  {
    id: '1',
    icon: '💸',
    title: 'Affordable rides for everyone',
    description: 'No surge pricing. Fair rates. Pay what you expect, every single time.',
  },
  {
    id: '2',
    icon: '📡',
    title: 'Live GPS tracking',
    description: 'Know exactly where your driver is. Share your trip with family and friends.',
  },
  {
    id: '3',
    icon: '✅',
    title: 'Safe & Secure with verified drivers',
    description: 'Every driver is background-checked and verified for your peace of mind.',
  },
];

interface SlideItemProps {
  item: SlideData;
}

const SlideItem: React.FC<SlideItemProps> = ({ item }) => (
  <View style={styles.slide}>
    <Animated.View entering={FadeInDown.duration(600)} style={styles.slideContent}>
      <Text style={styles.slideIcon}>{item.icon}</Text>
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
    <LinearGradient colors={GRADIENTS.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <View style={styles.header}>
          <Button
            title="Skip"
            onPress={handleSkip}
            variant="ghost"
            size="small"
          />
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
          <Button
            title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    alignItems: 'flex-end',
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
  slideIcon: {
    fontSize: 100,
    marginBottom: SPACING.xl,
  },
  slideTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  slideDescription: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.85,
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});
