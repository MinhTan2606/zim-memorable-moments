import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MomentCard } from "./MomentCard";
import { MOMENT_STORIES, MomentStory } from "../constants/mockData";
import { Colors, Typography, Spacing, Radius } from "../constants/theme";
import { useOrientation } from "../hooks/useOrientation";

const CARD_GAP = Spacing.md;
const STORY_COUNT = MOMENT_STORIES.length;

const LOOP_COPIES = 3;
const LOOP_LENGTH = STORY_COUNT * LOOP_COPIES;
const LOOP_DATA: MomentStory[] = Array.from(
  { length: LOOP_LENGTH },
  (_, i) => MOMENT_STORIES[i % STORY_COUNT],
);
const LOOP_START_INDEX = STORY_COUNT;

function flatIndexFromScrollEvent(
  e: NativeSyntheticEvent<NativeScrollEvent>,
  snapInterval: number,
  loopLength: number,
): number {
  const maxFlat = loopLength - 1;
  const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
  const offsetX = contentOffset.x;
  const vw = layoutMeasurement.width;
  const cw = contentSize.width;
  if (cw > 0 && vw > 0) {
    const maxOffsetX = Math.max(0, cw - vw);
    if (maxOffsetX > 0 && offsetX >= maxOffsetX - 4) {
      return maxFlat;
    }
  }
  return Math.max(0, Math.min(Math.round(offsetX / snapInterval), maxFlat));
}

function logicalIndex(flatIndex: number): number {
  return flatIndex % STORY_COUNT;
}

export function MomentSection() {
  const { cardWidth, cardHeight, sectionPaddingH, isLandscape } =
    useOrientation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [focusedFlatIndex, setFocusedFlatIndex] = useState(LOOP_START_INDEX);
  const focusedIndexSV = useSharedValue(LOOP_START_INDEX);
  const flatListRef = useRef<FlatList<MomentStory>>(null);
  const skipNextMomentumEndRef = useRef(false);
  const focusedFlatIndexRef = useRef(LOOP_START_INDEX);

  const snapInterval = cardWidth + CARD_GAP;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const flat = flatIndexFromScrollEvent(e, snapInterval, LOOP_LENGTH);
      focusedFlatIndexRef.current = flat;
      setActiveIndex(logicalIndex(flat));
      focusedIndexSV.value = flat;
      setFocusedFlatIndex((prev) => (prev === flat ? prev : flat));
    },
    [snapInterval, focusedIndexSV],
  );

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (skipNextMomentumEndRef.current) {
        skipNextMomentumEndRef.current = false;
        return;
      }

      const flatIdx = flatIndexFromScrollEvent(e, snapInterval, LOOP_LENGTH);
      const logIdx = logicalIndex(flatIdx);
      setActiveIndex(logIdx);

      if (flatIdx < STORY_COUNT) {
        skipNextMomentumEndRef.current = true;
        const target = flatIdx + STORY_COUNT;
        queueMicrotask(() => {
          flatListRef.current?.scrollToIndex({
            index: target,
            animated: false,
            viewPosition: 0,
          });
          focusedIndexSV.value = target;
          setFocusedFlatIndex(target);
          focusedFlatIndexRef.current = target;
        });
      } else if (flatIdx >= 2 * STORY_COUNT) {
        skipNextMomentumEndRef.current = true;
        const target = flatIdx - STORY_COUNT;
        queueMicrotask(() => {
          flatListRef.current?.scrollToIndex({
            index: target,
            animated: false,
            viewPosition: 0,
          });
          focusedIndexSV.value = target;
          setFocusedFlatIndex(target);
          focusedFlatIndexRef.current = target;
        });
      } else {
        focusedIndexSV.value = flatIdx;
        setFocusedFlatIndex(flatIdx);
        focusedFlatIndexRef.current = flatIdx;
      }
    },
    [snapInterval, focusedIndexSV],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<MomentStory> | null | undefined, index: number) => {
      const isLast = index === LOOP_LENGTH - 1;
      return {
        length: isLast ? cardWidth : snapInterval,
        offset: index * snapInterval,
        index,
      };
    },
    [cardWidth, snapInterval],
  );

  const onScrollToIndexFailed = useCallback(
    (info: { index: number }) => {
      flatListRef.current?.scrollToOffset({
        offset: info.index * snapInterval,
        animated: true,
      });
    },
    [snapInterval],
  );

  const applyFocusToIndex = useCallback(
    (logicalIdx: number) => {
      const idx = Math.max(0, Math.min(logicalIdx, STORY_COUNT - 1));
      setActiveIndex(idx);
      const flatTarget = LOOP_START_INDEX + idx;
      focusedFlatIndexRef.current = flatTarget;
      focusedIndexSV.value = flatTarget;
      setFocusedFlatIndex(flatTarget);
      flatListRef.current?.scrollToIndex({
        index: flatTarget,
        animated: true,
        viewPosition: 0,
      });
    },
    [focusedIndexSV],
  );

  const handleStoryPress = useCallback((story: MomentStory) => {
    console.log("Navigate to story:", story.id, story.title);
  }, []);

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<MomentStory>) => {
      const logIdx = logicalIndex(index);
      const focusedLogical = logicalIndex(focusedFlatIndex);
      return (
        <View style={{ marginRight: index < LOOP_LENGTH - 1 ? CARD_GAP : 0 }}>
          <MomentCard
            story={item}
            width={cardWidth}
            height={cardHeight}
            onPress={handleStoryPress}
            onFocusRequest={applyFocusToIndex}
            flatIndex={index}
            logicalIndex={logIdx}
            focusedIndexSV={focusedIndexSV}
            isFocused={focusedFlatIndex === index}
            accessibilitySelected={focusedLogical === logIdx}
          />
        </View>
      );
    },
    [
      cardWidth,
      cardHeight,
      handleStoryPress,
      applyFocusToIndex,
      focusedFlatIndex,
    ],
  );

  const keyExtractor = useCallback(
    (item: MomentStory, index: number) => `${item.id}-${index}`,
    [],
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={styles.section}>
        <View style={[styles.header, { paddingHorizontal: sectionPaddingH }]}>
          <View style={styles.headerTop}>
            <View style={styles.accentLine} />
            <Text style={styles.sectionEyebrow}>Cộng đồng ZIM</Text>
          </View>
          <Text style={styles.sectionTitle}>Khoảnh Khắc{"\n"}Đáng Nhớ</Text>
          <Text style={styles.sectionSubtitle}>
            Những câu chuyện truyền cảm hứng từ học viên ZIM trên khắp Việt Nam.
          </Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={LOOP_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          initialScrollIndex={LOOP_START_INDEX}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: sectionPaddingH },
          ]}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          accessibilityLabel="Danh sách khoảnh khắc đáng nhớ"
          accessibilityHint="Vuốt sang trái hoặc phải để xem thêm câu chuyện"
        />

        <View
          style={[styles.dotsContainer, { paddingHorizontal: sectionPaddingH }]}
          accessibilityLabel={`Đang xem câu chuyện ${activeIndex + 1} trong ${STORY_COUNT}`}
          accessibilityRole="progressbar"
        >
          {MOMENT_STORIES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
                isLandscape && styles.dotLandscape,
              ]}
            />
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  section: {
    gap: Spacing.xl,
    paddingVertical: Spacing["3xl"],
  },
  header: {
    gap: Spacing.md,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  accentLine: {
    width: 3,
    height: 14,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sectionEyebrow: {
    color: Colors.primary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.size["3xl"],
    fontWeight: Typography.weight.extraBold,
    lineHeight: Typography.size["3xl"] * 1.15,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.size.md,
    lineHeight: Typography.size.md * Typography.lineHeight.relaxed,
  },
  listContent: {
    gap: 0,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.textMuted,
    opacity: 0.4,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
    opacity: 1,
  },
  dotLandscape: {
    width: 8,
    height: 8,
  },
});
