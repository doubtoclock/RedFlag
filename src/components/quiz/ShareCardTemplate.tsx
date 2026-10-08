import React, { forwardRef } from "react";

interface ShareCardTemplateProps {
  percentage: number;
  isRedFlag: boolean;
  className?: string;
}

export const ShareCardTemplate = forwardRef<HTMLDivElement, ShareCardTemplateProps>(
  ({ percentage, isRedFlag, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center text-white ${className}`}
        style={{
          width: "1080px",
          height: "1920px",
          background: "#090909",
          padding: "120px 80px 80px 80px",
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
        <div style={{ position: "absolute", top: "80px", left: "70px", zIndex: 1, transform: "rotate(-6deg)" }}>
          <p style={{ fontSize: "36px", margin: "0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.9)" }}>SAME PEOPLE.</p>
          <p style={{ fontSize: "42px", margin: "-5px 0 0 0", fontFamily: "var(--font-sanggar)", color: isRedFlag ? "#f87171" : "#4ade80" }}>DIFFERENT</p>
          <p style={{ fontSize: "36px", margin: "-5px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.9)" }}>PERSPECTIVES.</p>
        </div>
        
        <div style={{ position: "absolute", top: "70px", right: "70px", zIndex: 1, textAlign: "center", transform: "rotate(4deg)" }}>
          <p style={{ fontSize: "32px", margin: "0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>BETTER</p>
          <p style={{ fontSize: "32px", margin: "-5px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>PEOPLE</p>
          <p style={{ fontSize: "32px", margin: "-5px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>BRIGHTER</p>
          <p style={{ fontSize: "32px", margin: "-5px 0 0 0", fontFamily: "var(--font-sanggar)", color: "rgba(255,255,255,0.85)" }}>DAYS</p>
        </div>

        {/* Content */}
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <p style={{ fontSize: "46px", letterSpacing: "18px", margin: "0 0 5px 0", opacity: 0.95, fontWeight: 600, fontFamily: "var(--font-outfit), sans-serif" }}>I SCORED</p>
          
          <p style={{ 
            fontSize: "400px", 
            lineHeight: 0.85, 
            fontWeight: 800, 
            margin: "0 0 20px 0",
            fontFamily: "serif",
            color: isRedFlag ? "#fecaca" : "#dcfce7",
            textShadow: isRedFlag ? "0 0 100px rgba(239,68,68,0.8)" : "0 0 100px rgba(34,197,94,0.8)"
          }}>
            {percentage}%
          </p>

          <p style={{ fontSize: "85px", margin: "25px 0 0 0", fontFamily: "var(--font-sanggar)", opacity: 0.95, transform: "rotate(-3deg)" }}>I&apos;M A</p>
          
          <p style={{ 
            fontSize: "180px", 
            lineHeight: 0.9, 
            fontWeight: 900, 
            margin: "-10px 0 30px 0",
            fontFamily: "serif",
            color: isRedFlag ? "#fca5a5" : "#c2f2b3",
            textShadow: isRedFlag ? "0 0 80px rgba(239,68,68,0.6)" : "0 0 80px rgba(34,197,94,0.6)",
            textAlign: "center",
            letterSpacing: "-2px"
          }}>
            {isRedFlag ? (
              <>RED<br/>FLAG</>
            ) : (
              "GREEN FLAG"
            )}
          </p>

          {/* Flag Graphic */}
          <div style={{ position: "relative", width: "700px", height: "450px", marginBottom: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img 
              src={isRedFlag ? "/red-flag.png" : "/green-flag.png"} 
              alt="Flag" 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "contain",
                filter: isRedFlag ? "drop-shadow(0 0 70px rgba(239,68,68,0.7))" : "drop-shadow(0 0 70px rgba(34,197,94,0.7))",
                transform: "scale(1.1)"
              }} 
              crossOrigin="anonymous"
            />
          </div>

          <p style={{ 
            fontSize: "80px", 
            margin: "0", 
            textAlign: "center",
            fontFamily: "var(--font-sanggar)",
            color: "white",
            transform: "rotate(-2deg)",
            textShadow: "2px 4px 10px rgba(0,0,0,0.5)"
          }}>
            THINK YOU CAN
          </p>
          <p style={{ 
            fontSize: "90px", 
            margin: "-10px 0 0 0", 
            textAlign: "center",
            fontFamily: "var(--font-sanggar)",
            color: isRedFlag ? "#f87171" : "#4ade80",
            transform: "rotate(-2deg)",
            textShadow: isRedFlag ? "0 0 30px rgba(239,68,68,0.5)" : "0 0 30px rgba(34,197,94,0.5)"
          }}>
            BEAT MY SCORE? 👀
          </p>
        </div>
      </div>
    );
  }
);

ShareCardTemplate.displayName = "ShareCardTemplate";
