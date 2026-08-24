import { ScalePoint } from "@/types/questionnaire";

export const LIKERT_SCALE: ScalePoint[] = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
];

// Never / Rarely / Sometimes / Often
export const FREQUENCY_A_SCALE: ScalePoint[] = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
];

// Never / Once or twice / A few times / Often
export const FREQUENCY_B_SCALE: ScalePoint[] = [
  { value: 1, label: "Never" },
  { value: 2, label: "Once or twice" },
  { value: 3, label: "A few times" },
  { value: 4, label: "Often" },
];
