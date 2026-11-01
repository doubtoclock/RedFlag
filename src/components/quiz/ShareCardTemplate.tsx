import React, { forwardRef } from "react";
import type { Personality, OverallResult, ShareSummary } from "@/lib/analytics/types";
import { getArchetypeImage } from "@/lib/analytics/personalities";

interface ShareCardTemplateProps {
  summary: ShareSummary;
  personality?: Personality;
  overall?: OverallResult;
  className?: string;
}

export const ShareCardTemplate = forwardRef<HTMLDivElement, ShareCardTemplateProps>(
  ({ summary, personality, overall, className = "" }, ref) => {
    const isRedFlag = overall?.isRedFlag ?? summary.isRedFlag;
    const greenPercent = overall?.greenPercent ?? summary.greenPercent;
    const score = `${greenPercent}%`;

    const title = personality?.title ?? summary.personalityTitle;
    const description = personality?.description ?? "You see the best in people and trust your instincts.";
    const flagStats = personality?.insights && personality.insights.length > 0
      ? personality.insights[personality.insights.length - 1]
      : null;
    const accent = personality?.accent ?? (isRedFlag ? "#fca5a5" : "#c2f2b3");
    const archetypeImageSrc = personality?.image || (personality?.id ? getArchetypeImage(personality.id) : null) || (isRedFlag ? "/red-flag.png" : "/green-flag.png");

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-between text-white ${className}`}
        style={{
          width: "1080px",
          height: "1920px",
          background: "#090909",
          padding: "120px 80px 100px",
          fontFamily: "var(--font-outfit), sans-serif",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Background Asset Layer (Same as The verdict is in. page) */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}>
          <img 
            src="/result-bg.png" 
            alt="" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} 
            crossOrigin="anonymous"
          />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.65)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.95) 100%)" }} />
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: isRedFlag
              ? "radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 35%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)"
          }} />
        </div>

        {/* Top Header: Score Pill */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "20px",
            padding: "18px 46px",
            borderRadius: "9999px",
            border: `2.5px solid ${isRedFlag ? "rgba(239,68,68,0.5)" : "rgba(74,222,128,0.5)"}`,
            backgroundColor: isRedFlag ? "rgba(239,68,68,0.18)" : "rgba(74,222,128,0.18)",
            backdropFilter: "blur(20px)",
            color: isRedFlag ? "#fca5a5" : "#86efac",
            fontSize: "36px",
            fontWeight: 700,
            letterSpacing: "6px",
            textTransform: "uppercase",
            boxShadow: isRedFlag ? "0 0 50px rgba(239,68,68,0.35)" : "0 0 50px rgba(74,222,128,0.35)"
          }}>
            <span>{score}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{isRedFlag ? "RED FLAG" : "GREEN FLAG"}</span>
          </div>
        </div>

        {/* Center Main Card: Flag Graphic & Archetype Info */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "920px",
          textAlign: "center",
          margin: "auto 0"
        }}>
          {/* Archetype Artwork */}
          <div style={{
            position: "relative",
            width: "440px",
            height: "440px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "28px",
            borderRadius: "44px",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)"
          }}>
            <img 
              src={archetypeImageSrc} 
              alt={title} 
              style={{ 
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }} 
              crossOrigin="anonymous"
            />
          </div>

          {/* Archetype Title in Sanggar Serif */}
          <h1 style={{
            fontSize: "92px",
            lineHeight: 1.08,
            margin: "16px 0 0",
            fontFamily: "var(--font-sanggar), serif",
            color: accent,
            letterSpacing: "-1px",
            textShadow: `0 0 40px ${accent}55`
          }}>
            {title}
          </h1>

          {/* Archetype Description */}
          <p style={{
            fontSize: "38px",
            lineHeight: 1.5,
            margin: "24px 0 0",
            color: "rgba(255,255,255,0.88)",
            maxWidth: "840px",
            fontWeight: 300
          }}>
            {description}
          </p>
        </div>

        {/* Bottom Footer */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          width: "100%"
        }}>
          <p style={{
            fontSize: "36px",
            fontFamily: "var(--font-sanggar), serif",
            color: isRedFlag ? "#fca5a5" : "#86efac",
            margin: 0,
            letterSpacing: "3px"
          }}>
            THINK YOU CAN BEAT MY SCORE?
          </p>
        </div>
      </div>
    );
  }
);

ShareCardTemplate.displayName = "ShareCardTemplate";
