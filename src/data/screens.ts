import { Screen } from "@/types/questionnaire";

// Groups question IDs into short, mobile-first screens (1-2 questions each).
// Conditional follow-up questions (q5b, q16f, q23f) share a screen with the
// question that triggers them and are only rendered when their showIf passes —
// this keeps the step count and progress bar stable regardless of branch taken.
export const SCREENS: Screen[] = [
  { id: "s1", questionIds: ["q1", "q2"] },
  { id: "s3", questionIds: ["q5a", "q5b"] },
  { id: "s4", questionIds: ["q6"] },
  { id: "s5", questionIds: ["q7"] },
  { id: "s6", questionIds: ["q8"] },
  { id: "s7", questionIds: ["q9"] },
  { id: "s13", questionIds: ["q15"] },
  { id: "s14", questionIds: ["q16", "q16f"] },
  { id: "s15", questionIds: ["q17"] },
  { id: "s18", questionIds: ["q21", "q22"] },
  { id: "s19", questionIds: ["q23", "q23f"] },
];
