// Shared types for the questionnaire question set and captured answers.
//
// Answer encoding (kept stable so a later scoring module can consume it):
//   - single-select        -> option value (string)
//   - multi-select          -> array of option values (string[])
//   - likert-5              -> 1 (Strongly disagree) .. 5 (Strongly agree)
//   - forced-choice-4       -> 1 (Strongly A) .. 4 (Strongly B), no midpoint
//   - frequency-4a / 4b     -> 1 (Never) .. 4 (Often)

export type SingleSelectAnswer = string;
export type MultiSelectAnswer = string[];
export type ScaleAnswer = number;

export type AnswerValue = SingleSelectAnswer | MultiSelectAnswer | ScaleAnswer;

export type Answers = Record<string, AnswerValue>;

export interface Option {
  value: string;
  label: string;
}

export interface ScalePoint {
  value: number;
  label: string;
}

export type QuestionType =
  | "single-select"
  | "multi-select"
  | "likert-5"
  | "forced-choice-4"
  | "frequency-4a"
  | "frequency-4b";

interface QuestionBase {
  id: string;
  section: string;
  prompt: string;
  helperText?: string;
  /** When present, the question only appears once this returns true for the current answers. */
  showIf?: (answers: Answers) => boolean;
}

export interface SingleSelectQuestion extends QuestionBase {
  type: "single-select";
  options: Option[];
}

export interface MultiSelectQuestion extends QuestionBase {
  type: "multi-select";
  options: Option[];
  /** Selecting one of these values clears every other selection (e.g. "None"). */
  exclusiveValues?: string[];
}

export interface LikertQuestion extends QuestionBase {
  type: "likert-5";
  statement: string;
}

export interface ForcedChoiceQuestion extends QuestionBase {
  type: "forced-choice-4";
  statementA: string;
  statementB: string;
}

export interface FrequencyQuestion extends QuestionBase {
  type: "frequency-4a" | "frequency-4b";
  statement: string;
}

export type Question =
  | SingleSelectQuestion
  | MultiSelectQuestion
  | LikertQuestion
  | ForcedChoiceQuestion
  | FrequencyQuestion;

export interface Screen {
  id: string;
  questionIds: string[];
}

// A safety interstitial shown inline in the questionnaire flow when a
// specific answer is given — independent of scoring/profile logic. Must be
// acknowledged before the user can advance past the screen that triggered it.
export interface SafetyPrompt {
  id: string;
  triggerQuestionId: string;
  triggerValues: string[];
  message: string;
  acknowledgeLabel: string;
}
