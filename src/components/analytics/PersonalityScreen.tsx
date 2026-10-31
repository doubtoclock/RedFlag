"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { PERSONALITY_RULES } from "@/lib/analytics/personalities";
import type { Personality } from "@/lib/analytics/types";

interface PersonalityScreenProps {
  personality: Personality;
  isRedFlag: boolean;
}

export function PersonalityScreen({ personality, isRedFlag }: PersonalityScreenProps) {
  const reduceMotion = useReducedMotion();
  const { title, description, emoji, accent, index, insights } = personality;

  return (
    <div className="flex flex-col items-center pt-3 text-center animate-in fade-in duration-700">

      {/* 3D Flag & Celestial Orbit Graphic */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="relative my-2 flex h-[150px] w-full max-w-[260px] items-center justify-center"
      >
        {/* Orbit rings */}
        <div
          className="absolute h-full w-full rotate-[-12deg] scale-y-[0.35] rounded-[100%] border-[0.5px]"
          style={{ borderColor: accent, boxShadow: `0 0 24px ${accent}55` }}
        />
        <div className="absolute h-full w-full rotate-[-12deg] scale-y-[0.35] rounded-[100%] border-[0.5px] border-white/20" />

        <div className="relative h-[150px] w-[170px] pointer-events-none">
          <Image
            src={isRedFlag ? "/red-flag.png" : "/green-flag.png"}
            alt=""
            fill
            sizes="170px"
            className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Floating emoji badge */}
        <span
          className="absolute bottom-1 right-5 flex h-[48px] w-[48px] items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur-xl text-[24px] shadow-2xl"
          style={{ boxShadow: `0 0 20px ${accent}44` }}
          aria-hidden="true"
        >
          {emoji}
        </span>
      </motion.div>

      {/* Title in Juana */}
      <h1
        className="mt-3 font-juana text-[32px] sm:text-[38px] font-normal leading-[1.08] tracking-tight drop-shadow-xl"
        style={{ color: accent }}
      >
        {title}
      </h1>
      <p className="mt-1 text-[10px] font-medium tracking-[0.25em] uppercase text-white/50">
        Archetype {String(index).padStart(2, "0")} of {PERSONALITY_RULES.length}
      </p>
      <p className="mt-3 max-w-[340px] font-sans text-[14px] sm:text-[15px] font-light leading-relaxed tracking-wide text-white/85">
        {description}
      </p>

      {/* Numbered Glass Insights (Styled consistently with Onboarding steps) */}
      <ul className="mt-6 flex flex-col gap-2.5 w-full">
        {insights.map((insight, insightIndex) => (
          <motion.li
            key={insight}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.2 + insightIndex * 0.08 }}
            className="flex items-start gap-3.5 p-3.5 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-md text-left transition-colors hover:border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <span
              className="mt-0.5 text-[10px] tracking-[0.2em] font-medium flex-shrink-0"
              style={{ color: accent }}
            >
              0{insightIndex + 1}
            </span>
            <p className="text-[13px] font-light leading-relaxed text-white/80">
              {insight}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
