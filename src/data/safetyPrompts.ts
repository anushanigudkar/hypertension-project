import { SafetyPrompt } from "@/types/questionnaire";

// Safety interstitials shown inline in the questionnaire flow itself — these
// are not personalization and don't depend on the scoring/profile module
// (which doesn't exist yet). Each fires the moment its trigger answer is
// given and must be acknowledged before the user can advance past that screen.
export const SAFETY_PROMPTS: SafetyPrompt[] = [
  {
    id: "q5b_replaced_part",
    triggerQuestionId: "q5b",
    triggerValues: ["replaced_part"],
    message:
      "It's worth talking to your doctor before changing how you take your prescribed medicine, even when adding other treatments alongside it. Would you like a reminder to bring this up at your next visit?",
    acknowledgeLabel: "Okay, continue",
  },
];
