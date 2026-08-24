import Link from "next/link";

interface SupportScreenLayoutProps {
  children: React.ReactNode;
}

// Shared wrapper for every /support/[slug] screen — built or placeholder —
// so navigation and spacing feel consistent with the rest of the app.
// Links home rather than "back" to results: there's no dedicated results
// URL today (it's just a phase of the single-page questionnaire), so a
// plain, always-reliable "Back to start" is more honest than implying this
// returns to exactly where the user came from.
export function SupportScreenLayout({ children }: SupportScreenLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col gap-8 px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-sage-500 transition-colors hover:text-sage-700"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Back to start
      </Link>
      <div className="flex flex-1 flex-col gap-6 pb-8">{children}</div>
    </div>
  );
}
