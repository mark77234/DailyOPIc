import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AnalyzingSection } from "@/components/practice/analyzing-section";
import { CompletedSection } from "@/components/practice/completed-section";
import { ListeningSection } from "@/components/practice/listening-section";
import { MainSection } from "@/components/practice/main-section";
import {
  FEEDBACK_BY_LEVEL,
  SAMPLE_ANSWER_BY_LEVEL,
} from "@/constants/practice";
import { usePracticeLogic } from "@/hooks/use-practice-logic";

export default function PracticeScreen() {
  const {
    targetLevelLabel,
    targetLevel,
    displayedTranscript,
    evaluationResult,
    questionsLoading,
    questionError,
    currentQuestion,
    isListening,
    isAnalyzing,
    isCompleted,
    errorMessage,
    handleToggleRecognition,
    handleSkipQuestion,
    handleNextQuestion,
  } = usePracticeLogic();

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const stopPulseAnimation = useCallback(() => {
    pulseAnimationRef.current?.stop();
    pulseAnim.setValue(0);
  }, [pulseAnim]);

  const startPulseAnimation = useCallback(() => {
    stopPulseAnimation();

    pulseAnimationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimationRef.current.start();
  }, [pulseAnim, stopPulseAnimation]);

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }

    return stopPulseAnimation;
  }, [isListening, startPulseAnimation, stopPulseAnimation]);

  useEffect(() => stopPulseAnimation, [stopPulseAnimation]);

  const handleAdvance = useCallback(
    () =>
      handleNextQuestion().catch((error) =>
        console.error("Failed to move to next question", error),
      ),
    [handleNextQuestion],
  );

  const handleSkip = useCallback(
    () =>
      handleSkipQuestion().catch((error) =>
        console.error("Failed to skip question", error),
      ),
    [handleSkipQuestion],
  );

  const renderIdleContent = () => {
    if (!questionsLoading && !currentQuestion) {
      return (
        <View className="mt-10 items-center">
          <Text className="text-base font-semibold text-gray-800">
            조건에 맞는 문제가 없습니다.
          </Text>
          <Text className="mt-2 text-sm text-gray-600">
            카테고리/태그/레벨 필터를 조정한 뒤 다시 시도하세요.
          </Text>
        </View>
      );
    }

    return (
      <ListeningSection
        pulseAnim={pulseAnim}
        isListening={isListening}
        onToggle={handleToggleRecognition}
      />
    );
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <AnalyzingSection />
      </SafeAreaView>
    );
  }

  if (isCompleted) {
    const feedbackMessage = FEEDBACK_BY_LEVEL[evaluationResult.level];
    const levelForSample = targetLevel ?? evaluationResult.level;
    const fallbackSample = SAMPLE_ANSWER_BY_LEVEL[levelForSample];
    const sampleAnswer =
      currentQuestion?.exampleAnswer?.trim() || fallbackSample.en;

    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 px-5 pt-4">
          <CompletedSection
            evaluation={evaluationResult}
            displayedTranscript={displayedTranscript}
            feedbackMessage={feedbackMessage}
            sampleAnswer={sampleAnswer}
            targetLevel={targetLevel}
            category={currentQuestion?.category}
            tags={currentQuestion?.tags ?? []}
            onNextQuestion={handleAdvance}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <MainSection
      targetLevelLabel={targetLevelLabel}
      onSkipQuestion={handleSkip}
      onResetTarget={() => router.push("/onboarding")}
      questionsLoading={questionsLoading}
      currentQuestion={currentQuestion}
      questionError={questionError}
      errorMessage={errorMessage}
    >
      {renderIdleContent()}
    </MainSection>
  );
}
