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
      

      <div className="flex items-center gap-12 sm:gap-20 mb-2 mt-4">
        <div className="flex flex-col items-center gap-4">
          <LiquidButton 
            disabled={isTransitioning}
            onClick={() => {
              if (!isTransitioning) {
                window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "left" }));
              }
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-red-500/30 bg-red-500/5 !p-0 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/50 hover:scale-[1.08] transition-all shadow-none disabled:opacity-50"
          >
            <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-red-500/70 fill-current ml-0.5" strokeWidth={1.5} />
          </LiquidButton>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium whitespace-nowrap">← RED FLAG</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <LiquidButton 
            disabled={isTransitioning}
            onClick={() => {
              if (!isTransitioning) {
                window.dispatchEvent(new CustomEvent("triggerSwipe", { detail: "right" }));
              }
            }}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-green-500/30 bg-green-500/5 !p-0 flex items-center justify-center hover:bg-green-500/10 hover:border-green-500/50 hover:scale-[1.08] transition-all shadow-none disabled:opacity-50"
          >
            <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-green-500/70 fill-current ml-0.5" strokeWidth={1.5} />
          </LiquidButton>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-medium whitespace-nowrap">GREEN FLAG →</span>
        </div>
      </div>
    </div>
  );
}
