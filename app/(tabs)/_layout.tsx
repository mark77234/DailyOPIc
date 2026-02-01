import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from "react-native-google-mobile-ads";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LEVEL_OPTIONS, TARGET_LEVEL_STORAGE_KEY } from "@/constants/opic";
import { colors, ThemeColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [checkingLevel, setCheckingLevel] = useState(true);
  const bannerRef = useRef<BannerAd>(null);
  const insets = useSafeAreaInsets();
  const isAdShow = false;
  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : "ca-app-pub-5460686409666356/5124626013";

  useForeground(() => {
    if (Platform.OS === "ios") {
      bannerRef.current?.load();
    }
  });

  useEffect(() => {
    let isMounted = true;

    const ensureLevelSelected = async () => {
      try {
        const storedLevel = await AsyncStorage.getItem(
          TARGET_LEVEL_STORAGE_KEY,
        );

        const hasValidLevel = LEVEL_OPTIONS.some(
          (option) => option.id === storedLevel,
        );

        if (!hasValidLevel) {
          router.replace("/onboarding");
          return;
        }

        if (isMounted) {
          setCheckingLevel(false);
        }
      } catch (error) {
        console.error("Failed to check target level", error);

        if (isMounted) {
          setCheckingLevel(false);
        }
      }
    };

    ensureLevelSelected();

    return () => {
      isMounted = false;
    };
  }, []);

  if (checkingLevel) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: ThemeColors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Practice",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="mic.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="checkmark.circle.fill"
                color={color}
              />
            ),
          }}
        />
      </Tabs>
      {(!__DEV__ || isAdShow) && (
        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.white,
            paddingBottom: Math.max(insets.bottom, 8),
          }}
        >
          <BannerAd
            ref={bannerRef}
            unitId={adUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          />
        </View>
      )}
    </View>
  );
}
