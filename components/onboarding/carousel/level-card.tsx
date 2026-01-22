import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
  width: number;
  height: number;
};

export function LevelCard({
  title,
  description,
  isActive,
  onPress,
  width,
  height,
}: Props) {
  return (
    <View
      className={`relative rounded-3xl border p-12 ${
        isActive
          ? "border-primary-500 bg-primary-100"
          : "border-gray-200 bg-white"
      }`}
      style={{ width, height }}
    >
      <View className="flex-1 items-center justify-center gap-6">
        <Text
          className={`text-center text-5xl font-semibold ${
            isActive ? "text-primary-600" : "text-gray-900"
          }`}
        >
          {title}
        </Text>

        <Text
          className={`text-center text-lg leading-6 ${
            isActive ? "text-primary-600" : "text-gray-600"
          }`}
        >
          {description}
        </Text>
      </View>

      <View className="w-full items-center">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          className={`w-full rounded-full py-3 ${
            isActive ? "bg-primary-600" : "border border-primary-400 bg-white"
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
}
