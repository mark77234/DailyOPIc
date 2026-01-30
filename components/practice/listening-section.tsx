import { Animated, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/constants/colors";

type ListeningSectionProps = {
  pulseAnim: Animated.Value;
  isListening: boolean;
  onToggle: () => void;
  onSkipQuestion: () => void;
};

export function ListeningSection({
  pulseAnim,
  isListening,
  onToggle,
  onSkipQuestion,
}: ListeningSectionProps) {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <View className="relative mt-6 h-32 w-32 items-center justify-center">
          {isListening && (
            <>
              <Animated.View
                className="absolute h-32 w-32 rounded-full bg-red-400"
                style={{
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.8],
                      }),
                    },
                  ],
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 0],
                  }),
                }}
              />
              <Animated.View
                className="absolute h-28 w-28 rounded-full bg-red-500"
                style={{
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.6],
                      }),
                    },
                  ],
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.25, 0],
                  }),
                }}
              />
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onToggle}
            className={`h-20 w-20 items-center justify-center rounded-full  ${
              isListening ? "bg-red-500" : "bg-primary-600"
            }`}
            style={{
              shadowColor: isListening ? colors.red : colors.primary[600], // iOS 그림자 색
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 10, // Android
            }}
          >
            <IconSymbol
              name={isListening ? "stop.fill" : "mic.fill"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        <Text className="mt-3 text-lg font-semibold text-gray-800">
          {isListening ? "Tap to Stop" : "Tap to Answer"}
        </Text>
        <Text className="mt-1 text-lg text-gray-500">
          {isListening ? "Listening..." : "녹음을 시작하려면 탭하세요."}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSkipQuestion}
          className="mt-12 rounded-full border border-primary-600 bg-white px-4 py-3 items-center"
          style={{
            shadowColor: colors.primary[600], // primary-600
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 1, // Android
          }}
        >
          <Text className="text-lg font-semibold text-primary-600">
            다른 질문으로 넘어가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
