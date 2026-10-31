"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, RefreshCw, Trophy } from "lucide-react";
import type { AnalyticsReport } from "@/lib/analytics/types";
import { BreakdownScreen } from "./BreakdownScreen";
import { FlagsScreen } from "./FlagsScreen";
import { PersonalityScreen } from "./PersonalityScreen";
import { VerdictScreen } from "./VerdictScreen";

const SCREEN_COUNT = 4;

interface ReportFlowProps {
  report: AnalyticsReport;
  step: number;
  direction: 1 | -1;
  onContinue: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onShare: () => void;
  onViewScoreCard: () => void;
  onRetake: () => void;
}

export function ReportFlow({ report, step, direction, onContinue, onBack, onShare, onViewScoreCard, onRetake }: ReportFlowProps) {
  const reduceMotion = useReducedMotion();
  const slide = reduceMotion ? 0 : 36;
  const { isRedFlag } = report.overall;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-30 flex justify-center bg-black pointer-events-auto overflow-hidden font-sans"
    >
      {/* Background Asset Layer with Atmospheric Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/result-bg.png"
          alt="Cinematic Background"
          fill
          priority
          className="object-cover opacity-70 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />
        <div
          className="absolute inset-0"
          style={{
            background: isRedFlag
              ? "radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 35%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-[100dvh] w-full max-w-[430px] flex-col [padding-top:var(--app-top-inset)] [padding-bottom:var(--app-bottom-inset)]">
        {/* Top Header: Completely empty on initial verdict step; minimal back button on subsequent steps */}
        <header className="relative z-10 flex flex-shrink-0 items-center justify-between px-5 h-10">
          {step > 1 ? (
            <button
              onClick={onBack}
              aria-label="Previous screen"
              className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
            </button>
          ) : null}
        </header>

        {/* Content Slides */}
        <main className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={{
                enter: (from: number) => ({ opacity: 0, x: from * slide }),
                center: { opacity: 1, x: 0 },
                exit: (from: number) => ({ opacity: 0, x: from * -slide }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-6"
            >
              {step === 1 && <VerdictScreen overall={report.overall} commentary={report.commentary} />}
              {step === 2 && <BreakdownScreen categories={report.categories} answered={report.overall.answered} />}
              {step === 3 && <FlagsScreen strongest={report.strongest} weakest={report.weakest} />}
              {step === 4 && <PersonalityScreen personality={report.personality} isRedFlag={isRedFlag} />}
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black to-transparent" />
        </main>

        {/* Bottom Navigation matching Onboarding Button Aesthetic */}
        <footer className="relative z-10 flex-shrink-0 px-5 pt-3 pb-2 flex flex-col items-center">
          <button
            onClick={step < SCREEN_COUNT ? onContinue : onShare}
            className="flex items-center justify-center gap-2 w-full max-w-[340px] rounded-full py-4 font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-[#eedbc2] to-[#e4cbad] hover:brightness-105 !text-black shadow-[0_8px_30px_rgba(238,219,194,0.25)] hover:duration-300 hover:ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 active:scale-100 active:translate-y-0"
          >
            {step === 1 ? "Reveal Analysis" : step < SCREEN_COUNT ? "Continue" : "Share Result"}
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          {step === SCREEN_COUNT && (
            <div className="mt-3.5 flex items-center justify-center gap-2.5 w-full max-w-[340px]">
              <button
                onClick={onViewScoreCard}
                className="flex-1 py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-[11px] uppercase tracking-[0.2em] font-medium text-white/90 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
              >
                <Trophy className="w-3.5 h-3.5" />
                Score Card
              </button>
              <button
                onClick={onRetake}
                className="flex-1 py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-[11px] uppercase tracking-[0.2em] font-medium text-white/90 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          )}
        </footer>
      </div>
    </motion.div>
  );
}
