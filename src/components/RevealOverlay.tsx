import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Colors, Typography, Spacing, Duration } from "../constants/theme";
import { useReduceMotion } from "../hooks/useReduceMotion";
import type { MomentStory } from "../constants/mockData";
import { ViewMoreButton } from "./ViewMoreButton";

interface RevealOverlayProps {
  story: MomentStory;
  isActive: boolean;
  onCtaPress?: () => void;
}

export function RevealOverlay({
  story,
  isActive,
  onCtaPress,
}: RevealOverlayProps) {
  const reduceMotion = useReduceMotion();

  const overlayOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(16);
  const textOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);

  const duration = reduceMotion ? 0 : Duration.reveal;
  const easing = Easing.bezier(0.25, 0.46, 0.45, 0.94);

  React.useEffect(() => {
    if (isActive) {
      overlayOpacity.value = withTiming(1, { duration, easing });
      textTranslateY.value = withDelay(
        reduceMotion ? 0 : 100,
        withTiming(0, { duration, easing }),
      );
      textOpacity.value = withDelay(
        reduceMotion ? 0 : 100,
        withTiming(1, { duration, easing }),
      );
      ctaOpacity.value = withDelay(
        reduceMotion ? 0 : 200,
        withTiming(1, { duration, easing }),
      );
    } else {
      overlayOpacity.value = withTiming(0, {
        duration: reduceMotion ? 0 : Duration.fast,
      });
      textOpacity.value = withTiming(0, {
        duration: reduceMotion ? 0 : Duration.fast,
      });
      textTranslateY.value = withTiming(16, {
        duration: reduceMotion ? 0 : Duration.fast,
      });
      ctaOpacity.value = withTiming(0, {
        duration: reduceMotion ? 0 : Duration.fast,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, reduceMotion]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents={isActive ? "box-none" : "none"}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
      />
      <View style={styles.content}>
        <Animated.View style={[styles.tagContainer, textStyle]}>
          <Text style={styles.tag}>{story.tag}</Text>
        </Animated.View>
        <Animated.Text style={[styles.caption, textStyle]}>
          {story.caption}
        </Animated.Text>
        <Animated.View style={ctaStyle}>
          <ViewMoreButton
            label={story.ctaLabel}
            onPress={onCtaPress}
            accessibilityHint={`Đọc câu chuyện: ${story.title}`}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: Colors.overlayDark,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  tagContainer: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  tag: {
    color: Colors.white,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  caption: {
    color: Colors.textPrimary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.regular,
    lineHeight: Typography.size.sm * Typography.lineHeight.relaxed,
  },
});
