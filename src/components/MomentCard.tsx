import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { MomentStory } from '../constants/mockData';
import { Colors, Duration, Radius, Spacing, Typography } from '../constants/theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { RevealOverlay } from './RevealOverlay';

interface MomentCardProps {
  story: MomentStory;
  width: number;
  height: number;
  onPress?: (story: MomentStory) => void;
  onFocusRequest?: (logicalIndex: number) => void;
  flatIndex: number;
  logicalIndex: number;
  focusedIndexSV: SharedValue<number>;
  isFocused?: boolean;
  accessibilitySelected?: boolean;
}

const FOCUS_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);

export function MomentCard({
  story,
  width,
  height,
  onPress,
  onFocusRequest,
  flatIndex,
  logicalIndex,
  focusedIndexSV,
  isFocused = false,
  accessibilitySelected,
}: MomentCardProps) {
  const reduceMotion = useReduceMotion();
  const [isHovered, setIsHovered] = useState(false);

  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const imageOverlayOpacity = useSharedValue(0.3);
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useAnimatedReaction(
    () => focusedIndexSV.value,
    idx => {
      const on = idx === flatIndex;
      if (reduceMotion) {
        focusProgress.value = on ? 1 : 0;
        return;
      }
      focusProgress.value = withTiming(on ? 1 : 0, {
        duration: on ? 160 : 120,
        easing: FOCUS_EASING,
      });
    },
    [flatIndex, reduceMotion],
  );

  const triggerMoveIn = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    translateY.value = withSpring(-10, { damping: 14, stiffness: 180 });
    cardScale.value = withSpring(1.02, { damping: 16, stiffness: 200 });
    imageOverlayOpacity.value = withTiming(0.1, { duration: Duration.normal });
  }, [reduceMotion, translateY, cardScale, imageOverlayOpacity]);

  const triggerMoveOut = useCallback(() => {
    'worklet';
    if (reduceMotion) return;
    translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
    cardScale.value = withSpring(1, { damping: 18, stiffness: 220 });
    imageOverlayOpacity.value = withTiming(0.3, { duration: Duration.normal });
  }, [reduceMotion, translateY, cardScale, imageOverlayOpacity]);

  const handleTap = useCallback(() => {
    onFocusRequest?.(logicalIndex);
  }, [onFocusRequest, logicalIndex]);

  const tap = Gesture.Tap()
    .maxDeltaX(14)
    .maxDeltaY(24)
    .onBegin(() => {
      triggerMoveIn();
    })
    .onEnd((_e, success) => {
      'worklet';
      if (success) {
        runOnJS(handleTap)();
      }
    })
    .onFinalize(() => {
      'worklet';
      triggerMoveOut();
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(setIsHovered)(false);
    });

  const composed = Gesture.Race(tap, longPress);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: cardScale.value },
    ],
  }));

  const baseOverlayStyle = useAnimatedStyle(() => ({
    opacity: imageOverlayOpacity.value,
  }));

  const focusAmbientStyle = useAnimatedStyle(() => {
    const p = focusProgress.value;
    return {
      shadowOpacity: 0.38 + 0.14 * p,
      shadowRadius: 12 + 8 * p,
    };
  });

  const focusRingStyle = useAnimatedStyle(() => {
    const p = focusProgress.value;
    return {
      opacity: interpolate(p, [0, 0.15, 1], [0, 0.85, 1]),
      transform: [{ scale: interpolate(p, [0, 1], [0.94, 1]) }],
    };
  });

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          styles.card,
          { width, height },
          cardStyle,
          focusAmbientStyle,
        ]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Khoảnh khắc: ${story.title}`}
        accessibilityHint="Nhấn để xem thêm về câu chuyện này"
        accessibilityState={{ selected: accessibilitySelected ?? isFocused }}
      >
        <Image
          source={{ uri: story.imageUrl }}
          placeholder={story.blurhash}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
          accessibilityIgnoresInvertColors
        />

        <Animated.View style={[StyleSheet.absoluteFill, styles.baseOverlay, baseOverlayStyle]} />

        {!isHovered && (
          <View style={styles.defaultContent}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>{story.tag}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {story.title}
            </Text>
          </View>
        )}

        <RevealOverlay
          story={story}
          isActive={isHovered}
          onCtaPress={() => {
            setIsHovered(false);
            onPress?.(story);
          }}
        />

        <Animated.View
          pointerEvents="none"
          style={[styles.focusBorderOverlay, focusRingStyle]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  focusBorderOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    borderColor: Colors.focusRing,
    shadowColor: Colors.focusRing,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  baseOverlay: {
    backgroundColor: Colors.overlayMedium,
  },
  defaultContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: Spacing['3xl'],
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  tagText: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    lineHeight: Typography.size.lg * 1.3,
  },
});
