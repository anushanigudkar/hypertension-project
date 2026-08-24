import Link from "next/link";
import { SupportScreenLayout } from "./SupportScreenLayout";

// A4 — monitoring avoidance: one reading is a snapshot, not a verdict.
// Calm, neutral treatment throughout — no alarming color singles out any
// one point on the wave, since the whole point is that natural variation
// is normal, not something to react to.
export function MonitoringReframeScreen() {
  return (
    <SupportScreenLayout>
      <h1 className="text-xl font-semibold leading-snug text-sage-900">
        One reading is a snapshot, not a verdict
      </h1>

      <VariationIllustration />

      <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-sage-700">
        <p>
          Blood pressure moves around naturally through the day. It responds to stress,
          activity, how much sleep you got — even how you&apos;re sitting when you check it.
        </p>
        <p>
          So if you check once and the number looks higher than you expected, that doesn&apos;t
          mean something is wrong. It&apos;s one moment, not the full picture.
        </p>
        <p>
          What actually tells you something useful is the pattern over time — not any single
          reading. A few relaxed check-ins across a week say a lot more than one number ever
          could.
        </p>
      </div>

      <p className="text-sm leading-relaxed text-sage-500">
        If you&apos;d like a simple way to build that fuller picture,{" "}
        <Link href="/support/b3-pattern" className="font-medium text-sage-600 underline underline-offset-2 hover:text-sage-800">
          a focused week of checking
        </Link>{" "}
        can help.
      </p>
    </SupportScreenLayout>
  );
}

function VariationIllustration() {
  // Independently scattered — not meant to sit precisely on the wave path,
  // just to show readings landing at different heights over time, all
  // within the same shaded "normal variation" band, none singled out.
  const dots = [
    { x: 30, y: 70 },
    { x: 90, y: 38 },
    { x: 150, y: 78 },
    { x: 210, y: 42 },
    { x: 270, y: 62 },
  ];

  return (
    <svg viewBox="0 0 320 120" className="w-full" role="img" aria-label="Blood pressure readings naturally varying within a normal range over time">
      <rect x="0" y="25" width="320" height="70" rx="12" className="fill-sage-50" />
      <path
        d="M10,60 Q45,25 80,60 T150,60 T220,60 T290,60"
        fill="none"
        className="stroke-sage-300"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {dots.map((dot) => (
        <circle key={dot.x} cx={dot.x} cy={dot.y} r="4.5" className="fill-sage-500" />
      ))}
    </svg>
  );
}
