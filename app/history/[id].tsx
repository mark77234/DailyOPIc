import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  loadPracticeHistory,
  type PracticeHistoryEntry,
} from "@/utils/practice-history";

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const [entry, setEntry] = useState<PracticeHistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizedId = useMemo(() => {
    if (!id) return null;
    return Array.isArray(id) ? id[0] : id;
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    const hydrateEntry = async () => {
      if (!normalizedId) {
        if (isMounted) {
          setEntry(null);
          setLoading(false);
        }
        return;
      }

      try {
        const history = await loadPracticeHistory();
        const match = history.find((item) => item.id === normalizedId) ?? null;

        if (isMounted) {
          setEntry(match);
        }
      } catch (error) {
        console.error("Failed to load practice history entry", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateEntry();

    return () => {
      isMounted = false;
    };
  }, [normalizedId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#4B24FF" />
          <Text className="mt-2 text-sm text-gray-600">
            기록을 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <IconSymbol
            name="exclamationmark.triangle.fill"
            size={20}
            color="#6F52EB"
          />
          <Text className="mt-3 text-base font-semibold text-gray-900">
            기록을 찾을 수 없어요
          </Text>
          <Text className="mt-1 text-center text-sm text-gray-600">
            최근 연습 기록을 찾지 못했습니다. Progress 탭에서 다시 시도해 주세요.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        bounces={false}
        contentContainerClassName="px-6 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-2xl border border-primary-200 bg-primary-100 p-4">
          <Text className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            평가 결과
          </Text>
          <View className="mt-2 flex-row items-center gap-2">
            <Text className="rounded-full bg-primary-600 px-3 py-1 text-sm font-bold text-white">
              {entry.evaluationLevel}
            </Text>
            {entry.targetLevel ? (
              <Text className="rounded-full border border-primary-200 bg-white px-3 py-1 text-[11px] font-semibold text-primary-600">
                목표 {entry.targetLevel}
              </Text>
            ) : null}
          </View>
          <Text className="mt-3 text-xs text-primary-600">
            녹음 시각: {formatDate(entry.createdAt)}
          </Text>
        </View>

        <View className="mt-4 rounded-2xl border border-primary-200 bg-white p-4">
          <Text className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Question
          </Text>
          <Text className="mt-2 text-lg font-semibold text-gray-900">
            {entry.questionText}
          </Text>
          <Text className="mt-2 text-sm text-gray-700">
            카테고리: {entry.category} · 문제 레벨: {entry.questionLevel}
          </Text>
          {entry.tags?.length ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Text
                  key={tag}
                  className="rounded-full bg-primary-100 px-3 py-1 text-[11px] font-semibold text-primary-600"
                >
                  #{tag}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View className="mt-4 rounded-2xl border border-primary-100 bg-primary-100 p-4">
          <View className="flex-row items-center gap-2">
            <IconSymbol name="paperplane.fill" size={18} color="#4B24FF" />
            <Text className="text-base font-semibold text-gray-900">
              내 답변 전문
            </Text>
          </View>
          <Text className="mt-3 text-base leading-6 text-gray-800">
            {entry.transcript}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
