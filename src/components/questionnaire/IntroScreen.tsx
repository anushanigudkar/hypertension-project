interface IntroScreenProps {
  onBegin: () => void;
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col justify-between px-6 py-10">
      <div className="flex flex-col gap-6 pt-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase tracking-wide text-sage-500">
            Before we start
          </span>
          <h1 className="text-2xl font-semibold leading-snug text-sage-900">
            A few questions about your blood pressure care
          </h1>
        </div>

        <p className="text-[15px] leading-relaxed text-sage-700">
          There are no right or wrong answers here. This isn&apos;t a test — it&apos;s just to help
          us understand what kind of support would actually be useful for you. Your answers are
          private and aren&apos;t shared with your doctor or anyone else unless you choose to.
        </p>

        <p className="text-sm text-sage-500">Takes about 5–7 minutes.</p>
      </div>

      <button
        type="button"
        onClick={onBegin}
        className="mt-10 w-full rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700 active:bg-sage-800"
      >
        Continue
      </button>
    </div>
  );
}
