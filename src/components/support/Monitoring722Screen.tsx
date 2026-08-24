"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newsreader } from "next/font/google";
import { SupportScreenLayout } from "./SupportScreenLayout";
import {
  fadeSlideVariants,
  staggerContainer,
  stepTransitionVariants,
  STEP_CROSS_FADE_TRANSITION,
  StepDots,
} from "./stepFlow";
import { DayCardWeekIllustration, MORNING_COLOR, EVENING_COLOR } from "./dayCardWeek";

// A4 + B3 combined — monitoring avoidance reframe, then the 722 checking
// pattern explained, then a calm worked example. One flow covers both
// constructs rather than sending people to two separate screens. Step 2's
// illustration is shared with the standalone B3-only screen — see
// dayCardWeek.tsx — so the "722 pattern" visual never drifts between them.

const newsreader = Newsreader({ subsets: ["latin"], weight: ["500"] });

const STEP_COUNT = 3;

export function Monitoring722Screen() {
  const [step, setStep] = useState(0);

  function handleNext() {
    setStep((s) => (s === STEP_COUNT - 1 ? 0 : s + 1));
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <SupportScreenLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepTransitionVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={STEP_CROSS_FADE_TRANSITION}
        >
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
        </motion.div>
      </AnimatePresence>

      <StepDots step={step} count={STEP_COUNT} />

      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-2xl border border-sage-200 px-5 py-4 text-[15px] font-medium text-sage-600 transition-colors hover:bg-sage-50"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="flex-1 rounded-2xl bg-sage-600 px-6 py-4 text-[15px] font-medium text-white transition-colors hover:bg-sage-700"
        >
          {step === STEP_COUNT - 1 ? "Restart" : "Next"}
        </button>
      </div>
    </SupportScreenLayout>
  );
}

function Step1() {
  const tealDots = [
    { x: 40, y: 70 },
    { x: 85, y: 60 },
    { x: 130, y: 82 },
    { x: 180, y: 65 },
    { x: 230, y: 78 },
    { x: 275, y: 60 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">
        One reading is a snapshot, not a verdict
      </h1>

      <motion.svg
        viewBox="0 0 320 150"
        className="w-full"
        role="img"
        aria-label="Several blood pressure readings clustered in a typical range, with one higher outlier reading above them"
        variants={staggerContainer}
      >
        <motion.rect
          x="10"
          y="55"
          width="300"
          height="40"
          rx="12"
          fill={EVENING_COLOR}
          fillOpacity="0.12"
          variants={fadeSlideVariants}
        />
        {tealDots.map((d) => (
          <motion.circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r="5" fill={EVENING_COLOR} variants={fadeSlideVariants} />
        ))}
        <motion.circle cx="205" cy="24" r="5.5" fill={MORNING_COLOR} variants={fadeSlideVariants} />
        <motion.text x="205" y="10" textAnchor="middle" className="fill-sage-600 text-[10px]" variants={fadeSlideVariants}>
          one day, higher
        </motion.text>
        <motion.text x="160" y="113" textAnchor="middle" className="fill-sage-500 text-[11px]" variants={fadeSlideVariants}>
          typical range
        </motion.text>
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        Blood pressure naturally moves around through the day. A single higher reading like this
        one isn&apos;t a verdict, it&apos;s normal ups and downs.
      </p>
    </div>
  );
}

function Step2() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Two readings, twice a day</h1>

      <DayCardWeekIllustration />

      <p className="text-[15px] leading-relaxed text-sage-700">
        The most reliable way to check: two readings, morning and evening, for about a week. That
        gives a far clearer picture than any single check ever could.
      </p>
    </div>
  );
}

function Step3() {
  return (
    <motion.div className="flex flex-col gap-6" variants={staggerContainer}>
      <motion.h1 variants={fadeSlideVariants} className="text-xl font-semibold leading-snug text-sage-900">
        How to read a higher number
      </motion.h1>

      <motion.div variants={fadeSlideVariants} className="flex flex-col gap-3 rounded-2xl border border-sage-200 bg-white px-5 py-5">
        <span className="text-xs font-medium uppercase tracking-wide text-sage-500">example reading</span>
        <span className="text-4xl font-semibold text-sage-900">128 / 82</span>
        <span
          className="w-fit rounded-full px-3 py-1 text-xs font-medium text-amber-800"
          style={{ backgroundColor: `${MORNING_COLOR}26` }}
        >
          a little higher today
        </span>
        <p className="text-[15px] leading-relaxed text-sage-700">
          Worth mentioning at your next visit. Nothing to act on right now.
        </p>
      </motion.div>

      <motion.p variants={fadeSlideVariants} className="text-[15px] leading-relaxed text-sage-700">
        Even on a higher day, it&apos;s information, not an alarm. Record your reading every day
        and check the average.
      </motion.p>

      <motion.p variants={fadeSlideVariants} className={`${newsreader.className} text-2xl text-sage-900`}>
        Information beats fear.
      </motion.p>
    </motion.div>
  );
}
