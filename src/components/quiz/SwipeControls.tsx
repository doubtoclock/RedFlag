"use client";

import { useEffect } from "react";
import { Flag } from "lucide-react";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface SwipeControlsProps {
  isVisible: boolean;
  isTransitioning: boolean;
  showInstructions?: boolean;
}

export function SwipeControls({ isVisible, isTransitioning, showInstructions = true }: SwipeControlsProps) {
  // Keyboard accessibility
  useEffect(() => {
    if (!isVisible || isTransitioning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "left" }));
      } else if (e.key === "ArrowRight") {
        window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "right" }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, isTransitioning]);

  return (
    <div className={`relative z-20 flex flex-col items-center transition-opacity duration-500 mt-2 ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex items-center gap-16 mb-2">
        <LiquidButton 
          disabled={isTransitioning}
          onClick={() => {
            if (!isTransitioning) {
              window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "left" }));
            }
          }}
          className="w-12 h-12 rounded-full border border-red-500/30 bg-red-500/5 !p-0 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 hover:scale-[1.08] transition-all shadow-none disabled:opacity-50"
        >
          <Flag className="w-5 h-5 text-red-500/70 fill-current ml-0.5" strokeWidth={1.5} />
        </LiquidButton>

        <LiquidButton 
          disabled={isTransitioning}
          onClick={() => {
            if (!isTransitioning) {
              window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "right" }));
            }
          }}
          className="w-12 h-12 rounded-full border border-green-500/30 bg-green-500/5 !p-0 flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/50 hover:scale-[1.08] transition-all shadow-none disabled:opacity-50"
        >
          <Flag className="w-5 h-5 text-green-500/70 fill-current ml-0.5" strokeWidth={1.5} />
        </LiquidButton>
      </div>

      <div className={`text-center text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium transition-opacity duration-500 ${showInstructions ? 'opacity-100' : 'opacity-0'}`}>
        <p>← RED FLAG &nbsp;&nbsp;&nbsp; GREEN FLAG →</p>
      </div>
    </div>
  );
}
