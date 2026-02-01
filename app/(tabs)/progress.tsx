import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  clearPracticeHistory,
  loadPracticeHistory,
  removePracticeHistoryEntry,
  type PracticeHistoryEntry,
} from "@/utils/practice-history";

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ProgressScreen() {
  const [history, setHistory] = useState<PracticeHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHistory = useCallback(async () => {
    setLoading(true);
    const items = await loadPracticeHistory();
    setHistory(items);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshHistory();
    }, [refreshHistory])
  );

  const totals = useMemo(
    () =>
      history.reduce<Record<string, number>>((acc, entry) => {
        acc[entry.evaluationLevel] = (acc[entry.evaluationLevel] ?? 0) + 1;
        return acc;
      }, {}),
    [history]
  );

  const lastEntry = history[0];
  const recentHistory = useMemo(() => history.slice(0, 8), [history]);
  const distribution = useMemo(
    () => Object.entries(totals).sort((a, b) => b[1] - a[1]),
    [totals]
  );
  const maxCount = useMemo(
    () => distribution.reduce((max, [, count]) => Math.max(max, count), 0),
    [distribution]
  );
  const chartHeight = 88;
  const chartMinHeight = 14;

  const handleOpenDetail = useCallback((entryId: string) => {
    router.push({ pathname: "/history/[id]", params: { id: entryId } });
  }, []);
  const handleDeleteEntry = useCallback(
    (entry: PracticeHistoryEntry) => {
      Alert.alert(
        "기록 삭제",
        "이 연습 기록을 삭제할까요? 삭제하면 복구할 수 없어요.",
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: async () => {
              const next = await removePracticeHistoryEntry(entry.id);
              setHistory(next);
            },
          },
        ]
      );
    },
    []
  );
  const handleDeleteAll = useCallback(() => {
    if (history.length === 0) return;

    Alert.alert(
      "전체 삭제",
      `${history.length}개의 기록을 모두 삭제할까요? 삭제하면 복구할 수 없어요.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "전체 삭제",
          style: "destructive",
          onPress: async () => {
            await clearPracticeHistory();
            setHistory([]);
          },
        },
      ]
    );
  }, [history.length]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text className="text-2xl font-semibold text-gray-900">통계</Text>
          <Text className="mt-1 text-sm text-gray-500">
            최근 연습 기록을 한눈에 확인하세요.
          </Text>
        </View>

        {loading ? (
          <View className="mt-6 min-h-[140px] items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <ActivityIndicator color="#2563eb" />
            <Text className="text-sm text-gray-600">기록을 불러오는 중...</Text>
          </View>
        ) : (
          <>
            <View className="mt-8 rounded-3xl border border-primary-300 bg-white px-4 pb-5 pt-7">
              <View className="absolute -top-4 left-0 right-0 items-center">
                <View className="rounded-full border border-primary-300 bg-white px-6 py-1.5">
                  <Text className="text-sm font-semibold text-primary-600">
                    요약
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-gray-50 p-4">
                  <Text className="text-xs font-semibold text-gray-500">
                    총 시도
                  </Text>
                  <Text className="mt-2 text-2xl font-bold text-gray-900">
                    {history.length}회
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-primary-100 p-4">
                  <Text className="text-xs font-semibold text-primary-600">
                    최근 등급
                  </Text>
                  <Text className="mt-2 text-2xl font-bold text-primary-600">
                    {lastEntry?.evaluationLevel ?? "-"}
                  </Text>
                  <View className="mt-3 flex-row items-center justify-end">
                    <Text className="rounded-full bg-primary-600 px-3 py-1 text-[11px] font-semibold text-white">
                      목표 {lastEntry?.targetLevel ?? "미설정"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mt-3 flex-row gap-3">
                <View className="flex-1 rounded-2xl bg-gray-50 p-4">
                  <Text className="text-xs font-semibold text-gray-500">
                    최근 연습
                  </Text>
                  <Text className="mt-2 text-sm font-semibold text-gray-900">
                    {lastEntry ? formatDateTime(lastEntry.createdAt) : "-"}
                  </Text>
                </View>
                <View className="flex-1 rounded-2xl bg-gray-50 p-4">
                  <Text className="text-xs font-semibold text-gray-500">
                    카테고리
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="mt-2 text-sm font-semibold text-gray-900"
                  >
                    {lastEntry?.category ?? "-"}
                  </Text>
                  <Text className="mt-1 text-[11px] text-right text-gray-500">
                    {lastEntry?.questionLevel
                      ? `문제 레벨 ${lastEntry.questionLevel}`
                      : "문제 레벨 -"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mt-10">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xl font-semibold text-gray-900">
                    최근 기록
                  </Text>
                  <Text className="mt-1 text-xs text-gray-500">
                    {history.length
                      ? `최근 ${recentHistory.length}개 표시`
                      : "최근 기록 없음"}
                  </Text>
                </View>
                {history.length > 0 && (
                  <TouchableOpacity
                    onPress={handleDeleteAll}
                    className="rounded-full border border-red-200 bg-white px-3 py-1"
                  >
                    <Text className="text-xs font-semibold text-red-600">
                      전체 삭제
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {history.length === 0 ? (
                <View className="mt-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6">
                  <Text className="text-center text-sm font-semibold text-gray-600">
                    아직 연습 기록이 없습니다.
                  </Text>
                  <Text className="mt-1 text-center text-xs text-primary-600">
                    Practice 탭에서 새 답변을 녹음해 보세요.
                  </Text>
                </View>
              ) : (
                <View className="mt-4 gap-3">
                  {recentHistory.map((entry) => (
                    <TouchableOpacity
                      key={entry.id}
                      activeOpacity={0.9}
                      onPress={() => handleOpenDetail(entry.id)}
                      className="rounded-2xl border border-primary-200 bg-white p-4"
                    >
                      <View className="flex-row items-start justify-between gap-3">
                        <View className="flex-1">
                          <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {formatDateTime(entry.createdAt)}
                          </Text>
                          <Text
                            numberOfLines={2}
                            className="mt-2 text-sm font-semibold text-gray-900"
                          >
                            {entry.questionText}
                          </Text>
                        </View>
                        <View className="items-end gap-2">
                          <Text className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                            {entry.evaluationLevel}
                          </Text>
                          <TouchableOpacity
                            onPress={() => handleDeleteEntry(entry)}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            className="rounded-full border border-red-200 px-2.5 py-1"
                          >
                            <Text className="text-[11px] font-semibold text-red-600">
                              삭제
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <Text className="mt-2 text-xs text-gray-600">
                        카테고리: {entry.category} · 문제 레벨:{" "}
                        {entry.questionLevel}
                      </Text>
                      <Text
                        numberOfLines={2}
                        className="mt-2 text-sm leading-5 text-gray-800"
                      >
                        {entry.transcript}
                      </Text>
                      {entry.tags?.length ? (
                        <View className="mt-2 flex-row flex-wrap gap-2">
                          {entry.tags.slice(0, 4).map((tag) => (
                            <Text
                              key={tag}
                              className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-700"
                            >
                              #{tag}
                            </Text>
                          ))}
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {history.length > 0 && distribution.length > 0 && (
              <View className="mt-8 rounded-3xl border border-primary-100 bg-white p-5">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-sm font-semibold text-gray-800">
                      등급 분포
                    </Text>
                    <Text className="mt-1 text-xs text-gray-500">
                      최근 {history.length}회 기준
                    </Text>
                  </View>
                  <View className="rounded-full bg-primary-100 px-3 py-1">
                    <Text className="text-[11px] font-semibold text-primary-600">
                      바 차트
                    </Text>
                  </View>
                </View>
                <View className="mt-6">
                  <View className="flex-row items-end justify-between gap-3">
                    {distribution.map(([level, count]) => {
                      const barHeight = maxCount
                        ? Math.max(
                            chartMinHeight,
                            Math.round((count / maxCount) * chartHeight)
                          )
                        : chartMinHeight;
                      const isTop = count === maxCount;
                      return (
                        <View key={level} className="flex-1 items-center">
                          <Text
                            className={`mb-2 text-[11px] font-semibold ${
                              isTop ? "text-primary-600" : "text-gray-400"
                            }`}
                          >
                            {count}회
                          </Text>
                          <View
                            className="w-full max-w-[28px] items-center justify-end rounded-full bg-primary-100"
                            style={{ height: chartHeight }}
                          >
                            <View
                              className={`w-full rounded-full ${
                                isTop ? "bg-primary-600" : "bg-primary-400"
                              }`}
                              style={{ height: barHeight }}
                            />
                          </View>
                          <Text className="mt-2 text-xs font-semibold text-gray-600">
                            {level}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
