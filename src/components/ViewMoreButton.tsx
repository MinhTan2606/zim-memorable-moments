import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  Duration,
} from "../constants/theme";
import { useReduceMotion } from "../hooks/useReduceMotion";

interface ViewMoreProps {
  label?: string;
  onPress?: () => void;
  accessibilityHint?: string;
}

export function ViewMoreButton({
  label = "Xem thêm",
  onPress,
  accessibilityHint,
}: ViewMoreProps) {
  const reduceMotion = useReduceMotion();

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onBegin(() => {
      if (reduceMotion) return;
      scale.value = withSpring(0.94, { damping: 15, stiffness: 400 });
      opacity.value = withTiming(0.75, { duration: Duration.fast });
    })
    .onFinalize(() => {
      if (reduceMotion) {
        onPress?.();
        return;
      }
      scale.value = withSequence(
        withSpring(1.06, { damping: 10, stiffness: 300 }),
        withSpring(1.0, { damping: 14, stiffness: 200 }),
      );
      opacity.value = withTiming(1, { duration: Duration.fast });
      onPress?.();
    });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[styles.button, animatedStyle]}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
      >
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.arrow}>→</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  label: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 0.3,
  },
  arrow: {
    color: Colors.white,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
});
