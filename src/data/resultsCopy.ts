// Friendly, non-clinical copy for the results screen. Kept as data (like
// questions.ts and safetyPrompts.ts) so wording can be revised without
// touching the logic that decides what to show.

export interface ConstructCopy {
  id: "A1" | "A4" | "B1";
  /** Short noun phrase for the low-tier reassurance aside, e.g. "getting your medicine without hassle" */
  lowLabel: string;
  /** Heading + body shown when this construct is a "high" active support area */
  highTitle: string;
  highBody: string;
}

export const CONSTRUCT_COPY: ConstructCopy[] = [
  {
    id: "A1",
    lowLabel: "understanding your blood pressure",
    highTitle: "Understanding your blood pressure",
    highBody:
      "Blood pressure can be high without you feeling anything different, and it can affect your health over time even on days you feel completely fine. A bit more clarity here could help.",
  },
  {
    id: "A4",
    lowLabel: "keeping up with checking when you plan to",
    highTitle: "Checking your blood pressure",
    highBody:
      "You've mentioned meaning to check your blood pressure and then not quite getting to it. We can help make that easier, so it doesn't feel like one more thing to put off.",
  },
  {
    id: "B1",
    lowLabel: "fitting your medicine into your routine",
    highTitle: "Fitting your medicine into your day",
    highBody:
      "Your day-to-day routine — work, travel, or just life — seems to be getting in the way of taking your medicine consistently. We can help find something that fits more naturally.",
  },
];

// B3 (monitoring routine, from q21) isn't part of profile.constructs, so it
// gets its own copy rather than an entry in CONSTRUCT_COPY.
export const B3_HIGH_COPY = {
  title: "Building a check-in habit",
  body: "You're not checking your blood pressure very often right now. Even a simple, occasional habit here can help you and your doctor spot changes early.",
};

// Shown when q21 is "very_frequently" — deliberately reassuring, not a
// "you're doing it wrong" framing.
export const OVERMONITORING_COPY = {
  title: "A note on checking often",
  body: "You're checking your blood pressure very often. That's not a problem — but it's usually not necessary either. Checking a few times a week, or as your doctor suggests, is normally plenty.",
};
