import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MomentSection } from "./src/components/MomentSection";
import { Colors, Typography, Spacing } from "./src/constants/theme";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mockHeader}>
            <Text style={styles.brandLogo}>ZIM</Text>
            <Text style={styles.brandTagline}>English Learning</Text>
          </View>
          <View style={styles.hero}>
            <Text style={styles.heroLabel}>Nền tảng luyện thi</Text>
            <Text style={styles.heroTitle}>
              Tiếng Anh{"\n"}đột phá cùng ZIM
            </Text>
          </View>
          <MomentSection />
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mockHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  brandLogo: {
    color: Colors.primary,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.extraBold,
    letterSpacing: 3,
  },
  brandTagline: {
    color: Colors.textSecondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    gap: Spacing.xs,
  },
  heroLabel: {
    color: Colors.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    lineHeight: Typography.size["2xl"] * 1.2,
  },
  bottomSpacer: {
    height: Spacing["5xl"],
  },
});
