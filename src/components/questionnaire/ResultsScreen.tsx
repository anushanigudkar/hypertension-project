import Link from "next/link";
import type { BehavioralProfile } from "@/lib/scoring";
import { buildResultsSummary } from "@/lib/buildResultsSummary";
import type { SupportArea } from "@/lib/buildResultsSummary";

interface ResultsScreenProps {
  profile: BehavioralProfile;
}

// Renders the scoring module's output as a calm, non-clinical summary.
// Never shows a raw score, a numeric tier, or a "moderate" construct — see
// buildResultsSummary.ts for the rules on what gets surfaced and why.
export function ResultsScreen({ profile }: ResultsScreenProps) {
  const summary = buildResultsSummary(profile);
  const hasNothingToShow = summary.supportAreas.length === 0 && !summary.overmonitoringNote;

  return (
    <div className="flex min-h-dvh flex-col gap-8 px-6 py-10">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sage-600"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-sage-900">Thank you</h1>
          <p className="max-w-xs text-[15px] leading-relaxed text-sage-600">
            Your answers have been recorded. Nothing here is a diagnosis — just a starting point
            for what support could look like for you.
          </p>
        </div>
      </header>

      {summary.supportAreas.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-sage-900">Areas we can help with</h2>
            <p className="text-sm text-sage-500">
              Based on what you shared, here&apos;s where a bit of support could make the biggest
              difference.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {summary.supportAreas.map((area) => (
              <SupportAreaCard key={area.id} area={area} />
            ))}
          </div>
        </section>
      )}

      {hasNothingToShow && (
        <p className="rounded-2xl bg-sage-50 px-4 py-4 text-[15px] leading-relaxed text-sage-800">
          Nothing here stood out as needing urgent attention — that&apos;s great.
        </p>
      )}

      {summary.overmonitoringNote && (
        <div className="flex flex-col gap-1.5 rounded-2xl bg-sage-50 px-4 py-4">
          <p className="text-[15px] font-medium text-sage-900">{summary.overmonitoringNote.title}</p>
          <p className="text-[15px] leading-relaxed text-sage-700">{summary.overmonitoringNote.body}</p>
        </div>
      )}

      {summary.reassuranceText && (
        <p className="text-sm leading-relaxed text-sage-500">{summary.reassuranceText}</p>
      )}
    </div>
  );
}

function SupportAreaCard({ area }: { area: SupportArea }) {
  return (
    <div className="rounded-2xl border border-sage-200 bg-white px-4 py-4">
      <p className="text-[15px] font-medium text-sage-900">{area.title}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-sage-700">{area.body}</p>
      <Link
        href={area.href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sage-600 transition-colors hover:text-sage-800"
      >
        See what might help
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
