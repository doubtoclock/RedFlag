"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flag } from "lucide-react";
import { NO_GREEN_FLAGS_MESSAGE, NO_RED_FLAGS_MESSAGE } from "@/lib/analytics/copy";
import type { CategoryHighlight } from "@/lib/analytics/types";

interface FlagSectionProps {
  title: string;
  isGreen: boolean;
  highlights: CategoryHighlight[];
  emptyMessage: string;
  delay: number;
}

function FlagSection({ title, isGreen, highlights, emptyMessage, delay }: FlagSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="text-left">
      {/* Flag Pill Badge */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: reduceMotion ? 0 : delay }}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md mb-3 ${
          isGreen
            ? "border-green-500/35 bg-green-500/10 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.15)]"
            : "border-red-500/35 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
        }`}
      >
        <Flag className="w-3.5 h-3.5 fill-current" />
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase font-sans">
          {title}
        </span>
      </motion.div>

      {highlights.length === 0 ? (
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/65 font-light pl-1">{emptyMessage}</p>
      ) : (
        <ol className="flex flex-col gap-2.5">
          {highlights.map((highlight, index) => (
            <motion.li
              key={highlight.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : delay + 0.1 + index * 0.08 }}
              className="p-4 rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-md text-left transition-all duration-300 hover:border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[14px] sm:text-[15px] font-medium leading-tight text-white tracking-wide">
                  {highlight.name}
                </h3>
                <span
                  className={`font-juana text-[22px] font-normal tabular-nums drop-shadow-sm ${
                    isGreen ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {highlight.percent}%
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] font-light leading-relaxed text-white/70">
                {highlight.explanation}
              </p>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}

interface FlagsScreenProps {
  strongest: CategoryHighlight[];
  weakest: CategoryHighlight[];
}

export function FlagsScreen({ strongest, weakest }: FlagsScreenProps) {
  const topStrongest = strongest.slice(0, 1);
  const topWeakest = weakest.slice(0, 1);

  return (
    <div className="flex min-h-full flex-col justify-center py-4 animate-in fade-in duration-700">
      {/* Main Page Heading */}
      <div className="mb-6 text-left">
        <h1 className="font-juana text-[36px] sm:text-[42px] text-white font-normal leading-[1.08] tracking-tight drop-shadow-lg">
          Flag <span className="italic text-[#eedbc2]">highlights</span>
        </h1>
        <p className="mt-2 text-white/80 text-[13.5px] sm:text-[14.5px] font-light tracking-wide leading-relaxed">
          Your sharpest instincts and the blind spots worth watching.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <FlagSection
          title="Strongest Green Flag"
          isGreen={true}
          highlights={topStrongest}
          emptyMessage={NO_GREEN_FLAGS_MESSAGE}
          delay={0.05}
        />
        <FlagSection
          title="Area of Caution"
          isGreen={false}
          highlights={topWeakest}
          emptyMessage={NO_RED_FLAGS_MESSAGE}
          delay={0.25}
        />
      </div>
    </div>
  );
}
