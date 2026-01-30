import type { ReactNode } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/constants/colors";
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
      <View className="flex-1 p-6 gap-4">
        <View className="flex-row justify-between items-center  p-4 rounded-2xl">
          <View className="flex-row gap-2">
            <Text className="text-lg text-gray-600">목표등급:</Text>
            <Text className="text-lg font-semibold text-primary-600">
              {targetLevelLabel}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onResetTarget}
            className="rounded-full border border-primary-400 px-4 py-2"
            style={{
              shadowColor: colors.primary[600], // primary-600
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 1, // Android
            }}
          >
            <Text className="text-lg font-semibold text-primary-600">
              목표 등급 다시 선택하기
            </Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-3xl border border-primary-400 bg-primary-100 px-6 py-8 ">
          {questionsLoading ? (
            <View className="items-center justify-center gap-2 py-8">
              <ActivityIndicator color="#2563eb" />
              <Text className="text-sm text-gray-600">
                문제를 불러오는 중입니다...
              </Text>
            </View>
          ) : (
            <>
              <Text className=" text-2xl font-bold text-gray-900">
                {currentQuestion?.questionText ??
                  "조건에 맞는 문제를 찾지 못했습니다. 필터를 수정하거나 데이터를 업로드하세요."}
              </Text>
              {currentQuestion?.tags?.length ? (
                <View className="mt-3 flex-row flex-wrap gap-2 ">
                  {currentQuestion.tags.map((tag) => (
                    <Text
                      key={tag}
                      className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
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

        <View className="flex-row justify-between border-primary-400 border rounded-full px-6 py-3 items-center">
          <Text className="text-lg text-gray-600">Category</Text>
          <Text className="text-lg font-semibold uppercase tracking-wide text-primary-600 pe-2">
            {currentQuestion?.category ?? "No Category"}
          </Text>
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
