import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UpdateCheckingScreenProps = {
  message: string;
};

export function UpdateCheckingScreen({ message }: UpdateCheckingScreenProps) {
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
