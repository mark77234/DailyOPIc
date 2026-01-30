import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { colors } from "@/constants/colors";
import type { LevelId } from "@/constants/opic";
import type { OpicEvaluationResult } from "@/utils/opic-evaluator";

type CompletedSectionProps = {
  evaluation: OpicEvaluationResult;
  displayedTranscript: string;
  feedbackMessage: string;
  sampleAnswer: string;
  targetLevel?: LevelId | null;
  category?: string | null;
  tags?: string[];
  onNextQuestion: () => void | Promise<void>;
};

export function CompletedSection({
  evaluation,
  displayedTranscript,
  feedbackMessage,
  sampleAnswer,
  targetLevel,
  category,
  tags,
  onNextQuestion,
}: CompletedSectionProps) {
  const { level, wordCount, sentenceCount } = evaluation;

  return (
    <View className="mt-6 flex-1 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View className="rounded-3xl border border-primary-400 bg-white px-5 py-6">
            <Text className="text-xl font-bold text-primary-600">
              나의 답변
            </Text>
            <Text className="mt-3 text-lg text-gray-700">
              {`"${displayedTranscript}"`}
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-primary-600 px-3 py-1">
                <Text className="text-sm font-semibold text-white">
                  문장 수: {sentenceCount}
                </Text>
              </View>
              <View className="rounded-full bg-primary-600 px-3 py-1">
                <Text className="text-sm font-semibold text-white">
                  단어 수: {wordCount}
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-sm text-gray-500">
              이번 답변에서 감지한 기본 길이 정보예요.
            </Text>
          </View>
          <View className="items-center self-center">
            <View className="h-16 w-px bg-primary-400" />
            <View
              className="h-2 w-2 rounded-full bg-primary-600"
              style={{
                shadowColor: colors.primary["600"],
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
                elevation: 10,
              }}
            />
          </View>
        </View>

        <View className="rounded-3xl bg-primary-600 p-5 my-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-base font-semibold uppercase tracking-wide text-white">
                OPIc 평가 등급
              </Text>
              <Text className="mt-1 text-4xl font-extrabold text-white">
                {level}
              </Text>
              {category && (
                <Text className="mt-3 text-sm  uppercase tracking-wide text-white">
                  Category: {category}
                </Text>
              )}
              {tags && tags.length > 0 && (
                <View className="my-2 flex-row flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Text
                      key={tag}
                      className="rounded-full bg-white px-2 py-1 text-sm text-primary-600"
                    >
                      #{tag}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
          <View className="my-2 w-full">
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={onNextQuestion}
              className="rounded-3xl border border-amber-200 bg-white px-4 py-3 w-full items-center justify-center"
            >
              <Text className="text-base font-extrabold text-primary-600">
                다음 질문으로 넘어가기
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="my-4">
          <View className="items-center">
            <View className="z-10 rounded-full border border-primary-600 bg-white px-6 py-2">
              <Text className="text-lg font-bold text-primary-600">
                {level} 등급 피드백
              </Text>
            </View>
          </View>
          <View className="-mt-6 rounded-3xl border border-primary-600 bg-primary-100 px-8 pb-6 pt-10">
            <Text className="text-base text-primary-600">
              {feedbackMessage}
            </Text>
          </View>
        </View>

        <View className="my-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 ">
          <Text className="text-xl font-semibold">
            {targetLevel ?? level} 수준의 샘플 답변
          </Text>
          <Text className="mt-3 text-lg text-gray-700">
            {`"${sampleAnswer}"`}
          </Text>
        </View>

        <View className="mt-4 mx-2">
          <Text className="text-sm text-gray-400">
            표시된 등급은 재미 요소일 뿐이며 실제 OPIc 등급과 다를 수 있어요.
            {"\n"}
            현재 산정 기준: 단어 수와 평균 문장 길이 중심 + 반복 단어, 군더더기
            너무 짧은 문장은 감점됩니다.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
