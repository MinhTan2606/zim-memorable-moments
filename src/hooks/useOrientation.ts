import { useWindowDimensions } from "react-native";
import { useMemo } from "react";
import { Spacing } from "../constants/theme";

interface OrientationLayout {
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  cardWidth: number;
  cardHeight: number;
  sectionPaddingH: number;
}

const CARD_GAP = Spacing.md;

export function useOrientation(): OrientationLayout {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const sectionPaddingH = Spacing.lg;

    const cardWidth = isLandscape
      ? (width - sectionPaddingH * 2 - CARD_GAP) * 0.52
      : width - sectionPaddingH * 2;

    const cardHeight = isLandscape ? 180 : 260;

    return {
      isLandscape,
      screenWidth: width,
      screenHeight: height,
      cardWidth,
      cardHeight,
      sectionPaddingH,
    };
  }, [width, height]);
}
