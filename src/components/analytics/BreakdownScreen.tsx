"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CategoryAnalytics, ScoreBand } from "@/lib/analytics/types";

const BAND_STYLES: Record<ScoreBand, { bar: string; text: string; label: string }> = {
  high: { bar: "bg-gradient-to-r from-green-500 to-green-400", text: "text-green-400", label: "Strong" },
  medium: { bar: "bg-gradient-to-r from-amber-400 to-amber-300", text: "text-amber-300", label: "Mixed" },
  low: { bar: "bg-gradient-to-r from-red-500 to-red-400", text: "text-red-400", label: "Worth a look" },
};

function answerCount(answered: number) {
  return `${answered} ${answered === 1 ? "answer" : "answers"}`;
}

interface BreakdownScreenProps {
  categories: CategoryAnalytics[];
  answered?: number;
}

export function BreakdownScreen({ categories }: BreakdownScreenProps) {
  const reduceMotion = useReducedMotion();
  const ranked = [...categories].sort((a, b) => (b.percent ?? -1) - (a.percent ?? -1));

  return (
    <div className="pt-2 animate-in fade-in duration-700">
      {/* Main Page Heading */}
      <div className="mb-6 text-left pt-2">
        <h1 className="font-juana text-[36px] sm:text-[42px] text-white font-normal leading-[1.08] tracking-tight drop-shadow-lg">
          Relationship<br />
          <span className="italic text-[#eedbc2]">breakdown</span>
        </h1>
        <p className="mt-2 text-white/80 text-[13.5px] sm:text-[14.5px] font-light tracking-wide leading-relaxed">
          Where your swipes held up, and where perspectives differed.
        </p>
      </div>

      {/* Glass Category Cards */}
      <ul className="flex flex-col gap-3">
        {ranked.map((category, index) => {
          const styles = category.band ? BAND_STYLES[category.band] : null;
          const isEarlyRead = category.answered > 0 && !category.rankable;

          return (
            <motion.li
              key={category.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.08 + index * 0.05 }}
              className="p-4 rounded-[20px] border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-[14px] sm:text-[15px] font-medium leading-tight text-white tracking-wide">
                  {category.name}
                </h2>
                {category.percent !== null && styles ? (
                  <span className={`font-juana text-[22px] font-normal tabular-nums drop-shadow-sm ${styles.text}`}>
                    {category.percent}%
                  </span>
                ) : (
                  <span className="text-[10px] font-medium tracking-[0.1em] text-white/40 uppercase">
                    Not enough data
                  </span>
                )}
              </div>

              <div className={`mt-2.5 h-[5px] w-full overflow-hidden rounded-full ${styles ? "bg-white/10" : "border border-dashed border-white/20"}`}>
                {category.percent !== null && styles && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percent}%` }}
                    transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.15 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${styles.bar} ${isEarlyRead ? "opacity-50" : ""}`}
                  />
                )}
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] tracking-[0.15em] uppercase text-white/50 font-medium">
                <span>{answerCount(category.answered)}</span>
                {styles && (
                  <span className={`font-semibold ${styles.text}`}>
                    {isEarlyRead ? "Early Read" : styles.label}
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
