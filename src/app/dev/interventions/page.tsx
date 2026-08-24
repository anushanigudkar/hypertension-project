import Link from "next/link";

const LINKS = [
  {
    title: "A1 — Pressure/pipe analogy",
    description: "Static explainer screen — real production route, no sample data needed.",
    href: "/support/pressure-pipe",
  },
  {
    title: "A4 + B3 — Monitoring reframe + 722 pattern (3-step)",
    description: "Routing target when both A4-high and B3-high fire together. No sample data needed.",
    href: "/support/monitoring-722",
  },
  {
    title: "B3 only — Steps 1-4 (fresh)",
    description:
      "Routing target when B3-high fires without A4-high. Fresh state, no config yet — starts on step 1.",
    href: "/dev/interventions/b3-pattern-start",
  },
  {
    title: "B3 only — Active status view",
    description: "Sample state: focused week started 2 days ago, reminders on with quick-tick logging.",
    href: "/dev/interventions/b3-pattern-active",
  },
  {
    title: "B1 — Steps 1-2 (why link it, pick a routine)",
    description: "Fresh state, no routine chosen — starts on step 1 to review the setup flow.",
    href: "/dev/interventions/routine-jar-start",
  },
  {
    title: "B1 — Step 3 (the jar, in progress)",
    description: "Sample state: routine already chosen, jar partially filled (12/21 days) — lands on step 3.",
    href: "/dev/interventions/routine-jar",
  },
];

// Personal dev tool for iterating on intervention screen designs directly —
// skips the questionnaire and scoring pipeline entirely. Not linked from
// anywhere in the real app; hidden in production via src/app/dev/layout.tsx.
export default function InterventionsDevIndex() {
  return (
    <div className="flex min-h-dvh flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="w-fit rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-sage-600">
          Dev only
        </span>
        <h1 className="text-xl font-semibold text-sage-900">Intervention screens</h1>
        <p className="text-sm leading-relaxed text-sage-500">
          Direct links to each built screen. B1 and B3 use hardcoded sample progress so their
          data-dependent visuals are visible without clicking through days of real use.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl border border-sage-200 bg-white px-4 py-4 transition-colors hover:border-sage-300 hover:bg-sage-50"
          >
            <p className="text-[15px] font-medium text-sage-900">{link.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-sage-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
