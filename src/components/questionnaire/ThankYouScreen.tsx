export function ThankYouScreen() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 py-10 text-center">
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
      <h1 className="text-xl font-semibold text-sage-900">Thank you</h1>
      <p className="max-w-xs text-[15px] leading-relaxed text-sage-600">
        Your answers have been recorded. They&apos;ll help us understand what kind of support
        would actually be useful for you.
      </p>
    </div>
  );
}
