"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SupportScreenLayout } from "./SupportScreenLayout";
import {
  fadeSlideVariants,
  fadeOnlyVariants,
  staggerContainer,
  stepTransitionVariants,
  STEP_CROSS_FADE_TRANSITION,
  StepDots,
} from "./stepFlow";

// A1 — understanding: blood pressure is like water pressure in a pipe,
// standing in for a blood vessel. Deliberately abstract plumbing imagery
// only — no anatomy, no organs. Replaces the earlier single-screen,
// rounded-pill pipe with radiating arrows entirely.

const STEP_COUNT = 3;
const TEAL = "#1D9E75";
const AMBER = "#EF9F27";

export function PressurePipeScreen() {
  const [step, setStep] = useState(0);

  function handleNext() {
    setStep((s) => (s === STEP_COUNT - 1 ? 0 : s + 1));
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <SupportScreenLayout>
      <p className="text-sm leading-relaxed text-sage-500">Think of this pipe as one of your blood vessels.</p>

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

      <p className="text-center text-xs leading-relaxed text-sage-400">
        This is a simplified illustration, not a literal medical depiction.
      </p>
    </SupportScreenLayout>
  );
}

// Shared pipe chassis — rigid look (small corner radius, not a pill),
// interior highlight stripe, and end-flange couplings. Reused at every
// size across all three steps so the pipe reads as the same object
// throughout. `children` renders inside the interior, between the flanges
// and beneath the highlight stripe.
function PipeShell({
  x,
  y,
  width,
  height,
  cornerRadius,
  children,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cornerRadius: number;
  children?: React.ReactNode;
}) {
  const flangeWidth = Math.max(6, width * 0.03);
  const flangeExtra = height * 0.18;

  return (
    <>
      <rect x={x} y={y} width={width} height={height} rx={cornerRadius} className="fill-sage-50 stroke-sage-300" strokeWidth="2.5" />
      {children}
      <rect
        x={x + width * 0.05}
        y={y + height * 0.14}
        width={width * 0.9}
        height={Math.max(2, height * 0.08)}
        rx={height * 0.04}
        fill="white"
        opacity="0.65"
      />
      <rect x={x - flangeWidth / 2} y={y - flangeExtra} width={flangeWidth} height={height + flangeExtra * 2} rx="2" className="fill-sage-300" />
      <rect
        x={x + width - flangeWidth / 2}
        y={y - flangeExtra}
        width={flangeWidth}
        height={height + flangeExtra * 2}
        rx="2"
        className="fill-sage-300"
      />
    </>
  );
}

// The interior narrowing — two teal humps pinching the channel, plus
// converging pressure-indicator lines just before the pinch.
function NarrowingInterior({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const midX = x + width / 2;
  const humpHalfSpan = width * 0.115;
  const topWallY = y + height * 0.16;
  const bottomWallY = y + height * 0.84;
  const pinchInset = height * 0.28;

  return (
    <>
      <path
        d={`M${midX - humpHalfSpan},${topWallY} Q${midX},${topWallY + pinchInset} ${midX + humpHalfSpan},${topWallY} Z`}
        fill={TEAL}
      />
      <path
        d={`M${midX - humpHalfSpan},${bottomWallY} Q${midX},${bottomWallY - pinchInset} ${midX + humpHalfSpan},${bottomWallY} Z`}
        fill={TEAL}
      />
      <line
        x1={x + width * 0.28}
        y1={y + height * 0.22}
        x2={x + width * 0.4}
        y2={y + height * 0.34}
        className="stroke-sage-400"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <line
        x1={x + width * 0.28}
        y1={y + height * 0.78}
        x2={x + width * 0.4}
        y2={y + height * 0.66}
        className="stroke-sage-400"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </>
  );
}

// The interior when medicine keeps things open — a clear channel with a
// few evenly spaced dots suggesting active, unrestricted flow.
function OpenFlowInterior({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const centerY = y + height / 2;
  const dotXs = [0.25, 0.42, 0.59, 0.76].map((f) => x + width * f);

  return (
    <>
      {dotXs.map((dotX) => (
        <circle key={dotX} cx={dotX} cy={centerY} r={Math.max(2, height * 0.09)} fill={TEAL} />
      ))}
    </>
  );
}

function GaugeIcon({ cx, cy, r, angle, color }: { cx: number; cy: number; r: number; angle: number; color: string }) {
  return (
    <>
      <path
        d={`M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`}
        fill="none"
        className="stroke-sage-200"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Positioned via a transform="rotate(...)" attribute, so its entrance
          animation is opacity-only — see the technical note in stepFlow.tsx. */}
      <motion.line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.72}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${angle}, ${cx}, ${cy})`}
        variants={fadeOnlyVariants}
      />
      <circle cx={cx} cy={cy} r="3" fill={color} />
    </>
  );
}

function Step1() {
  const [peeked, setPeeked] = useState(false);

  const pipe = { x: 20, y: 45, width: 280, height: 50 };
  const overlayInset = 4;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">What&apos;s really going on inside</h1>

      <motion.svg
        viewBox="0 0 320 130"
        className="w-full"
        role="img"
        aria-label={peeked ? "The pipe's interior, showing a narrowing with pressure building up before it" : "An ordinary-looking pipe"}
        variants={staggerContainer}
      >
        <motion.g variants={fadeSlideVariants}>
          <PipeShell {...pipe} cornerRadius={6}>
            <NarrowingInterior x={pipe.x} y={pipe.y} width={pipe.width} height={pipe.height} />
          </PipeShell>
        </motion.g>

        {/* Opaque cover over just the interior — the body outline, highlight
            stripe, and flanges above are drawn independently and are never
            covered. Fades away on "peek inside" via a plain CSS transition,
            not the entrance stagger, since it's a separate interaction. */}
        <rect
          x={pipe.x + overlayInset}
          y={pipe.y + pipe.height * 0.12}
          width={pipe.width - overlayInset * 2}
          height={pipe.height * 0.76}
          className={`fill-sage-50 transition-opacity duration-[600ms] ease-in-out ${peeked ? "opacity-0" : "opacity-100"}`}
        />
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        {peeked
          ? "But inside, there's a real narrowing, you can't see it or feel it, but it's there, and pressure is building up because of it."
          : "This pipe looks completely ordinary from outside."}
      </p>

      {!peeked && (
        <button
          type="button"
          onClick={() => setPeeked(true)}
          className="self-start rounded-2xl border border-sage-200 px-5 py-3 text-sm font-medium text-sage-600 transition-colors hover:bg-sage-50"
        >
          Peek inside
        </button>
      )}
    </div>
  );
}

function Step2() {
  const left = { x: 15, y: 50, width: 130, height: 40 };
  const right = { x: 175, y: 50, width: 130, height: 40 };
  const labelY = right.y + right.height + right.height * 0.36 + 20;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Same outside, different inside</h1>

      <motion.svg
        viewBox="0 0 320 150"
        className="w-full"
        role="img"
        aria-label="Two identical-looking pipes: one narrowed, one kept open by medicine"
        variants={staggerContainer}
      >
        <motion.g variants={fadeSlideVariants}>
          <PipeShell {...left} cornerRadius={5}>
            <NarrowingInterior {...left} />
          </PipeShell>
        </motion.g>
        <motion.g variants={fadeSlideVariants}>
          <PipeShell {...right} cornerRadius={5}>
            <OpenFlowInterior {...right} />
          </PipeShell>
        </motion.g>

        <motion.text x={left.x + left.width / 2} y={labelY} textAnchor="middle" className="fill-sage-600 text-[11px] font-medium" variants={fadeSlideVariants}>
          without medicine
        </motion.text>
        <motion.text x={right.x + right.width / 2} y={labelY} textAnchor="middle" className="fill-sage-600 text-[11px] font-medium" variants={fadeSlideVariants}>
          with medicine
        </motion.text>
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        From outside, they look the same. But one has a narrowing, a real physiological change,
        while the other&apos;s medicine keeps things open, so blood flows freely.
      </p>
    </div>
  );
}

function Step3() {
  const left = { x: 15, y: 95, width: 130, height: 40 };
  const right = { x: 175, y: 95, width: 130, height: 40 };
  const labelY = right.y + right.height + right.height * 0.36 + 20;
  const gaugeCy = 45;
  const gaugeR = 28;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-semibold leading-snug text-sage-900">Seeing it for yourself</h1>

      <motion.svg
        viewBox="0 0 320 195"
        className="w-full"
        role="img"
        aria-label="Two gauges above two pipes: one reading high, one reading normal"
        variants={staggerContainer}
      >
        <motion.g variants={fadeSlideVariants}>
          <GaugeIcon cx={left.x + left.width / 2} cy={gaugeCy} r={gaugeR} angle={55} color={AMBER} />
        </motion.g>
        <motion.g variants={fadeSlideVariants}>
          <GaugeIcon cx={right.x + right.width / 2} cy={gaugeCy} r={gaugeR} angle={-15} color={TEAL} />
        </motion.g>

        <motion.g variants={fadeSlideVariants}>
          <PipeShell {...left} cornerRadius={5}>
            <NarrowingInterior {...left} />
          </PipeShell>
        </motion.g>
        <motion.g variants={fadeSlideVariants}>
          <PipeShell {...right} cornerRadius={5}>
            <OpenFlowInterior {...right} />
          </PipeShell>
        </motion.g>

        <motion.text x={left.x + left.width / 2} y={labelY} textAnchor="middle" className="fill-sage-600 text-[11px] font-medium" variants={fadeSlideVariants}>
          without medicine
        </motion.text>
        <motion.text x={right.x + right.width / 2} y={labelY} textAnchor="middle" className="fill-sage-600 text-[11px] font-medium" variants={fadeSlideVariants}>
          with medicine
        </motion.text>
      </motion.svg>

      <p className="text-[15px] leading-relaxed text-sage-700">
        To see the effect of your medicine, a BP monitor helps you know the actual picture
        inside, not just guess. That&apos;s why it&apos;s worth checking periodically, not just
        once.
      </p>
    </div>
  );
}
