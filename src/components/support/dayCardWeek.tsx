"use client";

import { motion } from "framer-motion";
import { fadeSlideVariants, fadeOnlyVariants, staggerContainer } from "./stepFlow";

// Exact hex values requested — used identically for the day-card dots and
// the legend dots so they match precisely. Exported so any screen needing
// the same "722 pattern" colors (Step 3's pill badge, the standalone B3
// screen) reads from this one source rather than duplicating the literals.
export const MORNING_COLOR = "#EF9F27";
export const EVENING_COLOR = "#1D9E75";

// The 7-day-card illustration for the "722" checking pattern — shared
// between the combined A4+B3 flow's step 2 and the standalone B3-only
// screen so the visual (and its exact colors) never drift between the two.
// Doesn't declare its own initial/animate — inherits from whichever
// ancestor motion element controls entrance timing, per the transform/
// stagger rules documented in stepFlow.tsx.
export function DayCardWeekIllustration() {
  const dayCardX = [24, 64, 104, 144, 184, 224, 264];

  return (
    <motion.svg
      viewBox="0 0 320 150"
      className="w-full"
      role="img"
      aria-label="Seven day-cards, each showing a morning reading and an evening reading"
      variants={staggerContainer}
    >
      {dayCardX.map((x) => (
        <motion.g key={x} transform={`translate(${x}, 10)`} variants={fadeOnlyVariants}>
          <rect x="0" y="0" width="32" height="64" rx="8" className="fill-sage-50 stroke-sage-200" strokeWidth="1.5" />
          <circle cx="16" cy="18" r="6" fill={MORNING_COLOR} />
          <circle cx="16" cy="46" r="6" fill={EVENING_COLOR} />
        </motion.g>
      ))}

      <motion.text x="160" y="100" textAnchor="middle" className="fill-sage-600 text-[12px] font-medium" variants={fadeSlideVariants}>
        7 days
      </motion.text>

      <motion.g variants={fadeSlideVariants}>
        <circle cx="92" cy="125" r="5" fill={MORNING_COLOR} />
        <text x="104" y="129" className="fill-sage-600 text-[11px]">
          morning
        </text>
        <circle cx="192" cy="125" r="5" fill={EVENING_COLOR} />
        <text x="204" y="129" className="fill-sage-600 text-[11px]">
          evening
        </text>
      </motion.g>
    </motion.svg>
  );
}
