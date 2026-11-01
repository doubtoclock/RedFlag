"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { Personality, OverallResult } from "@/lib/analytics/types";
import {
  MESSAGES,
  type RelationshipStatus,
  getRelationshipMessage,
} from "@/lib/analytics/relationshipMessages";
import { getArchetypeImage } from "@/lib/analytics/personalities";

interface PersonalityScreenProps {
  personality: Personality;
  isRedFlag: boolean;
  overall?: OverallResult;
}

function removeEmojis(text: string): string {
  return text
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u20E3\uD83C-\uD83F\uDC00-\uDFFF]/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,!?"'’”])/g, "$1")
    .trim();
}

export function PersonalityScreen({ personality, isRedFlag, overall }: PersonalityScreenProps) {
  const reduceMotion = useReducedMotion();
  const { title, description, accent, insights } = personality;
  const flagInsight = insights && insights.length > 0 ? insights[insights.length - 1] : null;

  const [relStatus, setRelStatus] = useState<RelationshipStatus>("SINGLE");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("redflag_relationship") as RelationshipStatus;
      if (saved && MESSAGES[saved]) {
        setRelStatus(saved);
      }
    } catch {
      // Fallback to SINGLE
    }
  }, []);

  const scoreTier = overall?.tier ?? (isRedFlag ? "LOW" : "HIGH");
  const percentage = overall?.greenPercent ?? (isRedFlag ? 20 : 80);
  const { firstWords, lastTwoWords, subPart } =
    getRelationshipMessage(relStatus, scoreTier, percentage);

  const titleColor = isRedFlag ? "text-red-200" : "text-[#c2f2b3]";

  const cleanTitle = removeEmojis(title);
  const cleanDescription = removeEmojis(description);
  const cleanFlagInsight = flagInsight ? removeEmojis(flagInsight) : null;
  const cleanFirstWords = removeEmojis(firstWords);
  const cleanLastTwoWords = removeEmojis(lastTwoWords);
  const cleanSubPart = subPart ? removeEmojis(subPart) : "";

  const [imageError, setImageError] = useState(false);
  const imageSrc = personality.image || getArchetypeImage(personality.id);

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-4 text-center animate-in fade-in duration-700">

      {/* Archetype Image Artwork */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative my-2 flex h-[160px] w-[160px] sm:h-[190px] sm:w-[190px] items-center justify-center overflow-hidden rounded-[22px] flex-shrink-0 shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
      >
        {!imageError ? (
          <Image
            src={imageSrc}
            alt={cleanTitle}
            fill
            sizes="(max-width: 640px) 160px, 190px"
            priority
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-[64px]" role="img" aria-label={cleanTitle}>
            {personality.emoji}
          </span>
        )}
      </motion.div>

      {/* Title in Juana */}
      <h1
        className="mt-3 font-juana text-[34px] sm:text-[40px] font-normal leading-[1.08] tracking-tight drop-shadow-xl"
        style={{ color: accent }}
      >
        {cleanTitle}
      </h1>

      {/* Archetype Description */}
      <p className="mt-3 max-w-[360px] font-sans text-[14px] sm:text-[15px] font-light leading-relaxed tracking-wide text-white/85">
        {cleanDescription}
      </p>

      {/* Flag stats summary - seamlessly integrated without section box */}
      {cleanFlagInsight && (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.15 }}
          className="mt-4 max-w-[360px] font-sans text-[13.5px] sm:text-[14.5px] font-light leading-relaxed text-white/75"
        >
          {cleanFlagInsight}
        </motion.p>
      )}

      {/* Subtle Divider */}
      <div className="my-6 w-12 h-[1px] bg-white/20" />

      {/* Headline & Subtitle */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.25 }}
        className="w-full max-w-[360px] flex flex-col items-center"
      >
        <h2 className="px-1 text-center font-juana text-[24px] sm:text-[30px] font-medium leading-[1.2] text-white">
          {cleanFirstWords} <br />
          <span className={titleColor}>{cleanLastTwoWords}</span>
        </h2>

        {cleanSubPart && (
          <p className="mt-3 font-sans text-[15px] sm:text-[16px] text-white/85 text-center font-light leading-relaxed max-w-[340px]">
            {cleanSubPart}
          </p>
        )}
      </motion.div>
    </div>
  );
}
