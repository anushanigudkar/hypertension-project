"use client";

import { useMemo, useState } from "react";
import { QUESTIONS, QUESTIONS_BY_ID } from "@/data/questions";
import { SCREENS } from "@/data/screens";
import { SAFETY_PROMPTS } from "@/data/safetyPrompts";
import { Answers } from "@/types/questionnaire";
import { submitResponses } from "@/lib/submitResponses";
import { scoreProfile } from "@/lib/scoring";
import { IntroScreen } from "./IntroScreen";
import { ThankYouScreen } from "./ThankYouScreen";
import { ResultsScreen } from "./ResultsScreen";
import { ProgressBar } from "./ProgressBar";
import { QuestionRenderer } from "./QuestionRenderer";
import { SafetyPromptCard } from "./SafetyPromptCard";

type Phase = "intro" | "form" | "submitting" | "error" | "done";

function isAnswered(value: Answers[string] | undefined): boolean {
  if (value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function Questionnaire() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [acknowledgedPrompts, setAcknowledgedPrompts] = useState<Set<string>>(new Set());

  const currentScreen = SCREENS[screenIndex];
  const isLastScreen = screenIndex === SCREENS.length - 1;

  const visibleQuestions = useMemo(
    () =>
      currentScreen.questionIds
        .map((id) => QUESTIONS_BY_ID[id])
        .filter((question) => !question.showIf || question.showIf(answers)),
    [currentScreen, answers],
  );

  // Safety prompts triggered by the current screen's answers — must be
  // acknowledged before advancing, independent of any scoring/profile logic.
  const triggeredPrompts = useMemo(
    () =>
      SAFETY_PROMPTS.filter(
        (prompt) =>
          visibleQuestions.some((question) => question.id === prompt.triggerQuestionId) &&
          prompt.triggerValues.includes(answers[prompt.triggerQuestionId] as string),
      ),
    [visibleQuestions, answers],
  );
  const pendingPrompts = triggeredPrompts.filter((prompt) => !acknowledgedPrompts.has(prompt.id));

  const canAdvance =
    visibleQuestions.every((question) => isAnswered(answers[question.id])) && pendingPrompts.length === 0;

  function handleAnswer(questionId: string, value: Answers[string]) {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };

      // If this answer changes which conditional questions apply, drop any
      // stale answers for questions that are no longer visible.
      for (const question of QUESTIONS) {
        if (question.showIf && !question.showIf(next) && question.id in next) {
          delete next[question.id];
        }
      }

      return next;
    });
  }

  async function handleNext() {
    if (!canAdvance) return;

    if (!isLastScreen) {
      setScreenIndex((i) => i + 1);
      return;
    }

    setPhase("submitting");
    setSubmitError(null);
    try {
      await submitResponses(answers);
      setPhase("done");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setPhase("error");
    }
  }

  function handleAcknowledgePrompt(promptId: string) {
    setAcknowledgedPrompts((prev) => new Set(prev).add(promptId));
  }

  function handleBack() {
    if (screenIndex === 0) {
      setPhase("intro");
      return;
    }
    setScreenIndex((i) => i - 1);
  }

  if (phase === "intro") {
    return <IntroScreen onBegin={() => setPhase("form")} />;
  }

  if (phase === "done") {
    try {
      return <ResultsScreen profile={scoreProfile(answers)} />;
    } catch (err) {
      // Scoring is strict by design (throws on missing/invalid data) — that's
      // right for catching real bugs, but the user has just finished a long
      // form, so fall back to a plain thank-you rather than a blank crash.
      console.error("scoreProfile failed on a completed submission", err);
      return <ThankYouScreen />;
    }
  }

  const isSubmitting = phase === "submitting";

  return (
    <div className="flex min-h-dvh flex-col px-6 py-6">
      <ProgressBar current={screenIndex + 1} total={SCREENS.length} />

      <div className="flex flex-1 flex-col gap-8 py-8">
        {visibleQuestions.map((question) => (
          <QuestionRenderer key={question.id} question={question} answers={answers} onAnswer={handleAnswer} />
        ))}

        {pendingPrompts.map((prompt) => (
          <SafetyPromptCard
            key={prompt.id}
            prompt={prompt}
            onAcknowledge={() => handleAcknowledgePrompt(prompt.id)}
          />
        ))}
      </div>

      {phase === "error" && submitError && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="rounded-2xl border border-sage-200 px-5 py-4 text-[15px] font-medium text-sage-600 transition-colors hover:bg-sage-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canAdvance || isSubmitting}
          className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700 disabled:cursor-not-allowed disabled:bg-sage-300"
        >
          {isSubmitting ? "Saving…" : isLastScreen ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
