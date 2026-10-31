import React, { forwardRef } from "react";
import type { ShareSummary } from "@/lib/analytics/types";

interface ShareCardTemplateProps {
  summary: ShareSummary;
  className?: string;
}

function FlagHighlight({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 0, borderTop: `6px solid ${color}`, paddingTop: "20px" }}>
      <p style={{ fontSize: "26px", letterSpacing: "4px", margin: "0 0 14px", fontWeight: 700, color, fontFamily: "var(--font-outfit), sans-serif" }}>{label}</p>
      <p style={{ fontSize: "40px", lineHeight: 1.12, margin: "0", fontWeight: 700, color: "white", fontFamily: "var(--font-outfit), sans-serif" }}>{value}</p>
    </div>
  );
}

export const ShareCardTemplate = forwardRef<HTMLDivElement, ShareCardTemplateProps>(
  ({ summary, className = "" }, ref) => {
    const { greenPercent, isRedFlag, personalityTitle, biggestGreenFlag, biggestRedFlag } = summary;
    const score = `${greenPercent}%`;
    // Scores from 0–99 use three characters while 100% needs an extra digit.
    // Sizing from the rendered value protects the fixed 9:16 card margins.
    const scoreFontSize = score.length >= 4 ? "250px" : "290px";
    const personalityFontSize = personalityTitle.length > 22 ? "68px" : "82px";

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-white ${className}`}
        style={{
          width: "1080px",
          height: "1920px",
          background: "#090909",
          padding: "0",
          fontFamily: "sans-serif",
          position: "relative"
        }}
      >
        {/* Background Asset Layer */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, overflow: "hidden" }}>
          <img 
            src="/result-bg.png" 
            alt="Cinematic Background" 
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} 
            crossOrigin="anonymous"
          />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.95) 100%)" }} />
        </div>

        {/* Subtle background glow based on result */}
        <div style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1200px",
          height: "1200px",
          background: isRedFlag ? "radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(0,0,0,0) 65%)" : "radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(0,0,0,0) 65%)",
          zIndex: 0,
          pointerEvents: "none"
        }} />

        {/* Top accents */}
        <div style={{ position: "absolute", top: "72px", left: "64px", zIndex: 1, transform: "rotate(-6deg)", opacity: 0.78 }}>
          <p style={{ fontSize: "32px", margin: "0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.9)" }}>SAME PEOPLE.</p>
          <p style={{ fontSize: "38px", margin: "-4px 0 0 0", fontFamily: "var(--font-sanggar)", color: isRedFlag ? "#f87171" : "#4ade80" }}>DIFFERENT</p>
          <p style={{ fontSize: "32px", margin: "-4px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.9)" }}>PERSPECTIVES.</p>
        </div>
        
        <div style={{ position: "absolute", top: "64px", right: "64px", zIndex: 1, textAlign: "center", transform: "rotate(4deg)", opacity: 0.72 }}>
          <p style={{ fontSize: "28px", margin: "0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>BETTER</p>
          <p style={{ fontSize: "28px", margin: "-4px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>PEOPLE</p>
          <p style={{ fontSize: "28px", margin: "-4px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>BRIGHTER</p>
          <p style={{ fontSize: "28px", margin: "-4px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>DAYS</p>
        </div>

        {/* The fixed grid keeps every foreground element in its own 9:16 region. */}
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateRows: "70px 300px 210px 190px 220px 260px 170px",
          rowGap: "22px",
          alignContent: "end",
          width: "100%",
          height: "100%",
          padding: "170px 80px 64px",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
            <p style={{ fontSize: "42px", letterSpacing: "16px", margin: "0", opacity: 0.95, fontWeight: 600, fontFamily: "var(--font-outfit), sans-serif" }}>I SCORED</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <p style={{
              maxWidth: "920px",
              fontSize: scoreFontSize,
              lineHeight: 0.86,
              fontWeight: 800,
              margin: "0",
              fontFamily: "var(--font-sanggar), serif",
              color: isRedFlag ? "#fecaca" : "#dcfce7",
              textShadow: isRedFlag ? "0 0 78px rgba(239,68,68,0.72)" : "0 0 78px rgba(34,197,94,0.72)",
              whiteSpace: "nowrap"
            }}>
              {score}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: "60px", lineHeight: 1, margin: "0 0 12px", fontFamily: "var(--font-sanggar)", opacity: 0.95, transform: "rotate(-3deg)" }}>I&apos;M A</p>
            <p style={{
              fontSize: "124px",
              lineHeight: 0.9,
              fontWeight: 900,
              margin: "0",
              fontFamily: "var(--font-sanggar), serif",
              color: isRedFlag ? "#fca5a5" : "#c2f2b3",
              textShadow: isRedFlag ? "0 0 64px rgba(239,68,68,0.58)" : "0 0 64px rgba(34,197,94,0.58)",
              textAlign: "center",
              letterSpacing: "-2px"
            }}>
              {isRedFlag ? "RED FLAG" : "GREEN FLAG"}
            </p>
          </div>

          {/* Flag Graphic */}
          <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img 
              src={isRedFlag ? "/red-flag.png" : "/green-flag.png"} 
              alt="Flag" 
              style={{ 
                width: "420px",
                height: "190px",
                objectFit: "contain",
                filter: isRedFlag ? "drop-shadow(0 0 60px rgba(239,68,68,0.7))" : "drop-shadow(0 0 60px rgba(34,197,94,0.7))"
              }} 
              crossOrigin="anonymous"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
            <p style={{ fontSize: "28px", letterSpacing: "8px", margin: "0 0 18px", fontWeight: 600, opacity: 0.8, fontFamily: "var(--font-outfit), sans-serif" }}>MY RELATIONSHIP PERSONALITY</p>
            <p style={{
              fontSize: personalityFontSize,
              lineHeight: 1,
              margin: "0",
              textAlign: "center",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-1px",
              textTransform: "uppercase",
              fontFamily: "var(--font-outfit), sans-serif",
              textShadow: "2px 4px 10px rgba(0,0,0,0.5)"
            }}>
              {personalityTitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", minWidth: 0 }}>
            <FlagHighlight label="BIGGEST GREEN FLAG" value={biggestGreenFlag ?? "Still warming up"} color="#4ade80" />
            <FlagHighlight label="BIGGEST RED FLAG" value={biggestRedFlag ?? "None spotted"} color="#f87171" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
            <p style={{
              fontSize: "52px",
              lineHeight: 0.9,
              margin: "0",
              textAlign: "center",
              fontFamily: "var(--font-sanggar)",
              color: isRedFlag ? "#f87171" : "#4ade80",
              textShadow: isRedFlag ? "0 0 30px rgba(239,68,68,0.5)" : "0 0 30px rgba(34,197,94,0.5)"
            }}>
              THINK YOU CAN BEAT MY SCORE? 👀
            </p>
            <p style={{ fontSize: "30px", letterSpacing: "12px", margin: "26px 0 0", fontWeight: 700, opacity: 0.9, fontFamily: "var(--font-outfit), sans-serif" }}>🚩 RED FLAG GAME</p>
          </div>
        </div>
      </div>
    );
  }
);

ShareCardTemplate.displayName = "ShareCardTemplate";
