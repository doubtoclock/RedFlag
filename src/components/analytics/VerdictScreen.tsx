"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Flag } from "lucide-react";
import type { OverallResult } from "@/lib/analytics/types";

interface VerdictScreenProps {
  overall: OverallResult;
  commentary: string;
}

export function VerdictScreen({ overall, commentary }: VerdictScreenProps) {
  const { answered, greenPercent, redPercent, isRedFlag } = overall;
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(reduceMotion ? greenPercent : 0);
  const displayedPercent = useTransform(count, (value) => Math.round(value));

  useEffect(() => {
    const controls = animate(count, greenPercent, { duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" });
    return () => controls.stop();
  }, [count, greenPercent, reduceMotion]);

  const scoreGradient = isRedFlag
    ? "linear-gradient(to bottom, #fca5a5, #ef4444)"
    : "linear-gradient(to bottom, #e2fbd7, #4ade80)";

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-2 text-center animate-in fade-in duration-700">
      {/* Main Title in Juana with Champagne Italic Accent */}
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-juana text-[38px] sm:text-[46px] text-white font-normal leading-[1.08] tracking-tight drop-shadow-xl"
      >
        The verdict <span className="italic text-[#eedbc2]">is in.</span>
      </motion.h1>

      {/* Flag Result Pill Badge with Subtle Glow */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
        className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full border backdrop-blur-md mt-4 ${
          isRedFlag
            ? "border-red-500/40 bg-red-500/15 text-red-300 shadow-[0_0_24px_rgba(239,68,68,0.25)]"
            : "border-green-500/40 bg-green-500/15 text-green-300 shadow-[0_0_24px_rgba(74,222,128,0.25)]"
        }`}
      >
        <Flag className="w-4 h-4 fill-current" />
        <span className="text-[12px] sm:text-[13px] font-semibold tracking-[0.2em] uppercase font-sans">
          {isRedFlag ? "Red Flag! 🚩" : "Green Flag! 💚"}
        </span>
      </motion.div>

      {/* Percentage Number in Juana (Matches Onboarding and Score Card) */}
      <div className="mt-5 flex items-baseline justify-center">
        <span
          className="font-juana text-[84px] sm:text-[104px] leading-none tracking-tighter font-normal text-white drop-shadow-2xl"
          style={{
            background: scoreGradient,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          <motion.span className="tabular-nums">{displayedPercent}</motion.span>
        </span>
        <span
          className="font-juana text-[34px] sm:text-[40px] ml-1 font-normal"
          style={{
            background: scoreGradient,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          %
        </span>
      </div>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
        Green flag score
      </p>

      {/* Sleek Dual Ratio Progress Bar */}
      <div className="mt-6 w-full max-w-[340px]">
        <div className="mb-2 flex justify-between text-[11px] font-medium uppercase tracking-[0.15em]">
          <span className="text-green-400">Green {greenPercent}%</span>
          <span className="text-red-400">Red {redPercent}%</span>
        </div>
        <div className="relative h-2.5 w-full rounded-full bg-white/10 p-[1px] overflow-hidden backdrop-blur-sm border border-white/10 flex">
          {answered > 0 && greenPercent > 0 && (
            <motion.div
              initial={{ flexGrow: 0 }}
              animate={{ flexGrow: greenPercent }}
              transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            />
          )}
          {answered > 0 && redPercent > 0 && (
            <motion.div
              initial={{ flexGrow: 0 }}
              animate={{ flexGrow: redPercent }}
              transition={{ duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
            />
          )}
        </div>
      </div>

      {/* Frosted Glass Commentary Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.5, duration: 0.5 }}
        className="mt-6 w-full max-w-[350px] rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
      >
        <p className="font-sans text-[14.5px] sm:text-[15.5px] font-light leading-[1.65] tracking-wide text-white/90 text-center">
          {commentary}
        </p>
        <div className="w-8 h-[1px] bg-white/20 mx-auto mt-4" />
      </motion.div>
    </div>
  );
}
