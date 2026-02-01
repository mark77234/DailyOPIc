import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

type DistributionItem = {
  level: string;
  count: number;
};

type LevelDistributionChartProps = {
  data: DistributionItem[];
  totalCount: number;
};

const chartHeight = 120;
const chartMinHeight = 14;
const chartItemWidth = 56;

export default function LevelDistributionChart({
  data,
  totalCount,
}: LevelDistributionChartProps) {
  const maxCount = useMemo(
    () => data.reduce((max, item) => Math.max(max, item.count), 0),
    [data]
  );
  const chartWidth = Math.max(data.length * chartItemWidth, 240);

  if (data.length === 0) {
    return null;
  }

  const items = data.map((item) => ({
    ...item,
    isTop: item.count === maxCount && maxCount > 0,
  }));

  return (
    <View className="mt-8 rounded-3xl border border-primary-100 bg-white p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-semibold text-gray-800">등급 분포</Text>
          <Text className="mt-1 text-xs text-gray-500">
            최근 {totalCount}회 기준
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6"
        contentContainerStyle={{ minWidth: chartWidth }}
      >
        <View className="flex-row items-end gap-4 px-1">
          {items.map((item) => {
            const barHeight = maxCount
              ? Math.max(
                  chartMinHeight,
                  Math.round((item.count / maxCount) * chartHeight)
                )
              : chartMinHeight;
            return (
              <View
                key={item.level}
                className="items-center"
                style={{ width: chartItemWidth }}
              >
                <Text
                  className={`mb-2 text-[11px] font-semibold ${
                    item.isTop ? "text-primary-600" : "text-gray-400"
                  }`}
                >
                  {item.count}회
                </Text>
                <View
                  className="w-7 items-center justify-end rounded-full bg-primary-100"
                  style={{ height: chartHeight }}
                >
                  <View
                    className={`w-full rounded-full ${
                      item.isTop ? "bg-primary-600" : "bg-primary-400"
                    }`}
                    style={{ height: barHeight }}
                  />
                </View>
                <Text className="mt-2 text-xs font-semibold text-gray-600">
                  {item.level}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
