import { Question } from "@/types/questionnaire";

export const QUESTIONS: Question[] = [
  // ── Section 1 — About you and your treatment ─────────────────────────────
  {
    id: "q1",
    section: "About you and your treatment",
    type: "single-select",
    prompt: "Which age group are you in?",
    options: [
      { value: "35_44", label: "35–44" },
      { value: "45_54", label: "45–54" },
      { value: "55_64", label: "55–64" },
      { value: "65_plus", label: "65+" },
    ],
  },
  {
    id: "q2",
    section: "About you and your treatment",
    type: "single-select",
    prompt: "About how long ago were you diagnosed with high blood pressure?",
    options: [
      { value: "lt_6mo", label: "Less than 6 months ago" },
      { value: "6mo_2yr", label: "6 months – 2 years ago" },
      { value: "2_5yr", label: "2 – 5 years ago" },
      { value: "5yr_plus", label: "More than 5 years ago" },
    ],
  },
  {
    id: "q5a",
    section: "About you and your treatment",
    type: "single-select",
    prompt:
      "Lots of people use more than one kind of treatment for their health. Besides what's prescribed, are you also using anything else for your blood pressure — Ayurvedic, homeopathic, or a home remedy?",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "q5b",
    section: "About you and your treatment",
    type: "single-select",
    prompt: "Are you using this alongside your prescribed medicine, or has it mostly replaced part of it?",
    showIf: (answers) => answers.q5a === "yes",
    options: [
      { value: "alongside", label: "Alongside" },
      { value: "replaced_part", label: "Replaced part of it" },
    ],
  },
  {
    id: "q6",
    section: "About you and your treatment",
    type: "multi-select",
    prompt: "Do you manage any other ongoing health conditions?",
    helperText: "Select all that apply",
    options: [
      { value: "none", label: "None" },
      { value: "diabetes", label: "Diabetes" },
      { value: "heart_condition", label: "Heart condition" },
      { value: "kidney_condition", label: "Kidney condition" },
      { value: "other", label: "Other" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
    exclusiveValues: ["none", "prefer_not_to_say"],
  },

  // ── Section 2 — Understanding your blood pressure ────────────────────────
  {
    id: "q7",
    section: "Understanding your blood pressure",
    type: "likert-5",
    prompt: "How much do you agree with this statement?",
    statement: "If my blood pressure were high, I'd usually be able to feel it.",
  },
  {
    id: "q8",
    section: "Understanding your blood pressure",
    type: "forced-choice-4",
    prompt: "Which feels closer to how you see it?",
    statementA: "High blood pressure is something I'll likely need to manage on an ongoing basis.",
    statementB: "Once my BP is under control, I could probably stop or cut back on medicine.",
  },
  {
    id: "q9",
    section: "Understanding your blood pressure",
    type: "likert-5",
    prompt: "How much do you agree with this statement?",
    statement: "High blood pressure can cause damage even on days I feel completely fine.",
  },

  // ── Section 5 — Routine and remembering ──────────────────────────────────
  {
    id: "q15",
    section: "Routine and remembering",
    type: "frequency-4a",
    prompt: "In the last 2 weeks —",
    statement: "How often did you miss a dose simply because you forgot?",
  },
  {
    id: "q16",
    section: "Routine and remembering",
    type: "frequency-4b",
    prompt: "In the last 2 weeks —",
    statement:
      "Was there a day you chose not to take your blood pressure medicine — not because you forgot, but because you decided not to that day?",
  },
  {
    id: "q16f",
    section: "Routine and remembering",
    type: "multi-select",
    prompt: "What's usually going on when that happens?",
    helperText: "Select all that apply",
    showIf: (answers) => typeof answers.q16 === "number" && answers.q16 !== 1,
    options: [
      { value: "felt_fine", label: "I felt fine, so it didn't seem necessary that day" },
      { value: "stressed_upset", label: "I was stressed or upset and it wasn't the priority" },
      { value: "wanted_break", label: "I wanted a short break from taking it" },
      { value: "something_else", label: "Something else" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
    exclusiveValues: ["prefer_not_to_say"],
  },
  {
    id: "q17",
    section: "Routine and remembering",
    type: "likert-5",
    prompt: "How much do you agree with this statement?",
    statement:
      "My daily routine — work, travel, family responsibilities — makes it hard to take medicine at the same time every day.",
  },

  // ── Section 8 — Checking your blood pressure ─────────────────────────────
  {
    id: "q21",
    section: "Checking your blood pressure",
    type: "single-select",
    prompt: "How would you describe your blood pressure checking?",
    options: [
      { value: "dont_check_myself", label: "I don't check it myself" },
      { value: "only_when_unusual", label: "Only when I feel something unusual — dizzy, headache, unwell" },
      { value: "occasionally_no_pattern", label: "Occasionally, without much of a pattern" },
      { value: "focused_stretches", label: "I do focused stretches of checking (like a few days in a row) now and then" },
      { value: "very_frequently", label: "I check very frequently, almost every day" },
    ],
  },
  {
    id: "q22",
    section: "Checking your blood pressure",
    type: "single-select",
    prompt:
      "Do you have access to a blood pressure monitor — your own, a family member's, or one at a nearby pharmacy?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q23",
    section: "Checking your blood pressure",
    type: "frequency-4b",
    prompt: "In the last few months —",
    statement: "Was there a time you meant to check your blood pressure but ended up putting it off or deciding not to?",
  },
  {
    id: "q23f",
    section: "Checking your blood pressure",
    type: "multi-select",
    prompt: "What usually gets in the way?",
    helperText: "Select all that apply",
    showIf: (answers) => typeof answers.q23 === "number" && answers.q23 !== 1,
    options: [
      { value: "no_monitor_handy", label: "I don't have a monitor handy" },
      { value: "slips_my_mind", label: "It slips my mind — I just don't think about it" },
      { value: "doesnt_feel_important", label: "It doesn't feel that important" },
      { value: "anxious_about_number", label: "I'm a bit anxious about what the number might show" },
      { value: "something_else", label: "Something else" },
      { value: "prefer_not_to_say", label: "Prefer not to say" },
    ],
    exclusiveValues: ["prefer_not_to_say"],
  },
];

export const QUESTIONS_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);
