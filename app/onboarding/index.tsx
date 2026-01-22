import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  LEVEL_OPTIONS,
  LevelId,
  TARGET_LEVEL_STORAGE_KEY,
} from "@/constants/opic";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [listReady, setListReady] = useState(false);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const listRef = useRef<FlatList<(typeof LEVEL_OPTIONS)[number]>>(null);
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = screenWidth * 0.65;
  const cardHeight = 320;
  const cardGap = 16;
  const snapInterval = cardWidth + cardGap;
  const [listWidth, setListWidth] = useState(screenWidth);
  const sidePadding = Math.max(0, (listWidth - cardWidth) / 2);

  useEffect(() => {
    const loadSavedLevel = async () => {
      try {
        const storedLevel = await AsyncStorage.getItem(
          TARGET_LEVEL_STORAGE_KEY,
        );

        if (
          storedLevel &&
          LEVEL_OPTIONS.some((option) => option.id === storedLevel)
        ) {
          setSelectedLevel(storedLevel as LevelId);
        }
      } catch (error) {
        console.error("Failed to load saved target level", error);
      }
    };

    loadSavedLevel();
  }, []);

  useEffect(() => {
    if (!selectedLevel || hasAutoScrolled || !listReady) return;

    const index = LEVEL_OPTIONS.findIndex(
      (option) => option.id === selectedLevel,
    );

    if (index < 0) return;

    setCurrentIndex(index);
    listRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });
    setHasAutoScrolled(true);
  }, [selectedLevel, hasAutoScrolled, listReady]);

  const handleContinue = async () => {
    if (!selectedLevel || isSaving) return;

    try {
      setIsSaving(true);
      await AsyncStorage.setItem(TARGET_LEVEL_STORAGE_KEY, selectedLevel);
      router.replace("/");
    } catch (error) {
      console.error("Failed to save target level", error);
      setIsSaving(false);
    }
  };

  const handleConfirmLevel = (index: number) => {
    const level = LEVEL_OPTIONS[index];

    if (!level) return;

    if (selectedLevel === level.id) {
      handleContinue();
      return;
    }

    setSelectedLevel(level.id);
    setCurrentIndex(index);
    if (index !== currentIndex) {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / snapInterval);
    const clampedIndex = Math.max(0, Math.min(index, LEVEL_OPTIONS.length - 1));

    setCurrentIndex(clampedIndex);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerClassName="flex-grow px-6 pb-12 pt-10"
        bounces={false}
      >
        <View className="my-12">
          <Text className="text-center text-3xl font-semibold text-gray-900">
            목표 오픽 등급을 선택하세요
          </Text>
          <Text className="mt-3 text-center text-base text-gray-600">
            선택한 목표는 이후 홈 화면에서 계속 확인할 수 있어요.
          </Text>
        </View>

        <View className="flex-1 justify-center">
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
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                listRef.current?.scrollToIndex({
                  index: info.index,
                  animated: false,
                  viewPosition: 0.5,
                });
              }, 50);
            }}
            style={{ height: cardHeight }}
            contentContainerStyle={{
              paddingHorizontal: sidePadding,
            }}
            ItemSeparatorComponent={() => <View style={{ width: cardGap }} />}
            getItemLayout={(_, index) => ({
              length: snapInterval,
              offset: sidePadding + snapInterval * index,
              index,
            })}
            renderItem={({ item, index }) => {
              const isActive = item.id === selectedLevel;

              return (
                <View
                  className={`relative rounded-3xl border p-12 ${
                    isActive
                      ? "border-primary-500 bg-primary-100"
                      : "border-gray-200 bg-white"
                  }`}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                  }}
                >
                  {/* ✅ 텍스트를 수직 중앙으로 */}
                  <View className="flex-1 items-center justify-center gap-6">
                    <Text
                      className={`text-center text-5xl font-semibold ${
                        isActive ? "text-primary-600" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </Text>

                    <Text
                      className={`text-center text-lg leading-6 ${
                        isActive ? "text-primary-600" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </Text>
                  </View>

                  {/* ✅ 버튼은 아래 */}
                  <View className="w-full items-center  ">
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleConfirmLevel(index)}
                      className={`rounded-full w-full py-3 ${
                        isActive
                          ? "bg-primary-600"
                          : "border border-primary-400 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          isActive ? "text-white" : "text-primary-600"
                        }`}
                      >
                        {isActive ? "선택 완료" : "선택"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />

          <View className="mt-4 flex-row items-center justify-center">
            {LEVEL_OPTIONS.map((level, index) => {
              const isActive = index === currentIndex;

              return (
                <View
                  key={level.id}
                  className={`mx-1 rounded-full ${
                    isActive ? "bg-primary-600" : "bg-gray-300"
                  }`}
                  style={{
                    width: isActive ? 10 : 6,
                    height: isActive ? 10 : 6,
                  }}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
