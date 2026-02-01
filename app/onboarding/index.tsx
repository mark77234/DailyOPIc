// app/onboarding.tsx (or 기존 파일)
import { LevelCarousel } from "@/components/onboarding/carousel/level-carousel";
import { colors } from "@/constants/theme";
import { useTargetLevel } from "@/hooks/onboarding/use-target-level";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const { selectedLevel, setSelectedLevel, save, isSaving } = useTargetLevel();

  const handleContinue = async () => {
    if (!selectedLevel || isSaving) return;
    await save(selectedLevel);
    router.replace("/");
  };

  return (
    <LinearGradient
      colors={[colors.white, colors.primary[100]]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerClassName="flex-grow px-6 pb-12 pt-10"
          bounces={false}
        >
          <View className="mt-12">
            <Text className="text-center text-3xl font-semibold text-gray-900">
              목표 오픽 등급을 선택하세요
            </Text>
            <Text className="mt-3 text-center text-base text-gray-600">
              선택한 목표는 이후 홈 화면에서 계속 확인할 수 있어요.
            </Text>
          </View>

          <View className="flex-1 justify-center">
            <LevelCarousel
              selectedLevel={selectedLevel}
              onSelect={setSelectedLevel}
              onDoubleConfirm={handleContinue}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
