import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import type { QuestionDoc } from "@/types/question";

type MainSectionProps = {
  targetLevelLabel: string;
  onResetTarget: () => void;
  questionsLoading: boolean;
  currentQuestion: QuestionDoc | null;
  questionError?: string | null;
  errorMessage?: string | null;
  children: ReactNode;
};

export function MainSection({
  targetLevelLabel,
  onResetTarget,
  questionsLoading,
  currentQuestion,
  questionError,
  errorMessage,
  children,
}: MainSectionProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-4">
        <View className="flex-row items-start justify-between">
          <View>
            <View className="mt-1 flex-row items-center gap-2">
              <Text className="text-base text-gray-600">목표등급:</Text>
              <Text className="text-base font-semibold text-primary-600">
                {targetLevelLabel}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onResetTarget}
          className="mt-3 self-start rounded-full border border-primary-200 bg-primary-50 px-3 py-2"
        >
          <Text className="text-base font-semibold text-primary-600">
            목표 등급 다시 선택하기
          </Text>
        </TouchableOpacity>

        <View className="mt-6 rounded-2xl border border-gray-300 bg-white p-5">
          {questionsLoading ? (
            <View className="items-center justify-center gap-2 py-8">
              <ActivityIndicator color="#2563eb" />
              <Text className="text-sm text-gray-600">
                문제를 불러오는 중입니다...
              </Text>
            </View>
          ) : (
            <>
              <Text className="self-start rounded-full bg-primary-100 px-3 py-1 text-base font-semibold uppercase tracking-wide text-primary-600">
                {currentQuestion?.category ?? "No Category"}
              </Text>
              <Text className="mt-3 text-2xl font-semibold text-gray-900">
                {currentQuestion?.questionText ??
                  "조건에 맞는 문제를 찾지 못했습니다. 필터를 수정하거나 데이터를 업로드하세요."}
              </Text>
              {currentQuestion?.tags?.length ? (
                <View className="mt-3 flex-row flex-wrap gap-2">
                  {currentQuestion.tags.map((tag) => (
                    <Text
                      key={tag}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      #{tag}
                    </Text>
                  ))}
                </View>
              ) : null}
              {questionError && (
                <Text className="mt-3 text-sm text-red-600">
                  {questionError}
                </Text>
              )}
            </>
          )}
        </View>

        {errorMessage && (
          <View className="mt-3 flex-row items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={18}
              color="#b45309"
              style={{ marginTop: 2 }}
            />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-amber-900">
                음성 인식이 잠시 멈췄어요
              </Text>
              <Text className="mt-1 text-xs leading-5 text-amber-800">
                {errorMessage}
              </Text>
              <Text className="mt-1 text-[11px] font-semibold text-amber-900">
                마이크를 휴대폰 가까이에 대고 이어서 쭉 말씀해 주세요.
              </Text>
            </View>
          </View>
        )}

        {children}
      </View>
    </SafeAreaView>
  );
}
