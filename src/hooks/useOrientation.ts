import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import { Spacing } from '../constants/theme';

interface OrientationLayout {
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  /** Width của mỗi story card */
  cardWidth: number;
  /** Height của mỗi story card */
  cardHeight: number;
  /** Horizontal padding của section */
  sectionPaddingH: number;
}

const CARD_GAP = Spacing.md;

/**
 * R-01: Tính toán layout responsive theo orientation.
 * Portrait: 1 card chiếm 85% màn hình.
 * Landscape: 2 cards hiển thị (mỗi card ~45% màn hình).
 */
export function useOrientation(): OrientationLayout {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const sectionPaddingH = Spacing.lg;

    // Portrait: 1 card ~ 85% width, Landscape: 2 cards hiển thị
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
