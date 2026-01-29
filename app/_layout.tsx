import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Updates from "expo-updates";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

const UPDATE_CHECK_MESSAGE = "최신 업데이트 확인 중 입니다...";

function UpdateCheckingScreen({ message }: { message: string }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="small" color="#4f46e5" />
        <Text className="mt-3 text-sm font-medium text-gray-600">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(true);
  const [updateMessage, setUpdateMessage] = useState(UPDATE_CHECK_MESSAGE);

  useEffect(() => {
    let isMounted = true;

    const checkForUpdates = async () => {
      try {
        if (!Updates.isEnabled) {
          return;
        }

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          if (isMounted) {
            setUpdateMessage("업데이트를 다운로드하는 중...");
          }

          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return;
        }
      } catch (error) {
        console.error("Failed to check for updates", error);
      } finally {
        if (isMounted) {
          setIsCheckingUpdate(false);
        }
      }
    };

    checkForUpdates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {isCheckingUpdate ? (
        <UpdateCheckingScreen message={updateMessage} />
      ) : (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="onboarding/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="history/[id]"
            options={{ title: "연습 기록", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="question-filters"
            options={{ title: "Question Filters" }}
          />
          <Stack.Screen name="admin/index" options={{ title: "Admin Seed" }} />
        </Stack>
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
