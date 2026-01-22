import { LEVEL_OPTIONS, LevelId } from "@/constants/opic";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
import { LevelCard } from "./level-card";
import { LevelIndicator } from "./level-indicator";

type Props = {
  selectedLevel: LevelId | null;
  onSelect: (level: LevelId) => void;
  onDoubleConfirm?: () => void; // 같은 레벨 다시 누르면 계속 진행 같은 용도
};

export function LevelCarousel({
  selectedLevel,
  onSelect,
  onDoubleConfirm,
}: Props) {
  const [listReady, setListReady] = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);

  const listRef = useRef<FlatList<(typeof LEVEL_OPTIONS)[number]>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.65;
  const cardHeight = 320;
  const cardGap = 16;
  const snapInterval = cardWidth + cardGap;

  const [listWidth, setListWidth] = useState(screenWidth);
  const sidePadding = Math.max(0, (listWidth - cardWidth) / 2);

  // ✅ 저장된 레벨이 있으면 해당 카드로 자동 이동
  useEffect(() => {
    if (!selectedLevel || hasAutoScrolled || !listReady) return;

    const index = LEVEL_OPTIONS.findIndex((o) => o.id === selectedLevel);
    if (index < 0) return;

    listRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });

    setHasAutoScrolled(true);
  }, [selectedLevel, hasAutoScrolled, listReady]);

  const handlePressCardButton = (index: number) => {
    const level = LEVEL_OPTIONS[index];
    if (!level) return;

    if (selectedLevel === level.id) {
      onDoubleConfirm?.();
      return;
    }

    onSelect(level.id);

    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <View className="items-center gap-8">
      <FlatList
        ref={listRef}
        horizontal
        data={LEVEL_OPTIONS}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        bounces={true}
        onLayout={(event) => {
          setListWidth(event.nativeEvent.layout.width);
          setListReady(true);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({
              index: info.index,
              animated: false,
              viewPosition: 0.5,
            });
          }, 50);
        }}
        style={{ height: cardHeight, flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        ItemSeparatorComponent={() => <View style={{ width: cardGap }} />}
        getItemLayout={(_, index) => ({
          length: snapInterval,
          offset: sidePadding + snapInterval * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const isActive = item.id === selectedLevel;

          return (
            <LevelCard
              title={item.title}
              description={item.description}
              isActive={isActive}
              width={cardWidth}
              height={cardHeight}
              onPress={() => handlePressCardButton(index)}
            />
          );
        }}
      />

      <LevelIndicator
        count={LEVEL_OPTIONS.length}
        snapInterval={snapInterval}
        scrollX={scrollX}
      />
    </View>
  );
}
