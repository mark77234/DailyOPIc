import { Animated, View } from "react-native";

type Props = {
  count: number;
  snapInterval: number;
  scrollX: Animated.Value;
};

export function LevelIndicator({ count, snapInterval, scrollX }: Props) {
  return (
    <View className="mt-4 flex-row items-center justify-center">
      {Array.from({ length: count }).map((_, index) => {
        const inputRange = [
          (index - 1) * snapInterval,
          index * snapInterval,
          (index + 1) * snapInterval,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 1.4, 0.6],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <View
            key={index}
            style={{
              width: 12,
              height: 12,
              marginHorizontal: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#D1D5DB",
              }}
            />
            <Animated.View
              style={{
                position: "absolute",
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#512FE2",
                opacity,
                transform: [{ scale }],
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
