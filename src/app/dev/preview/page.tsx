"use client";

import React, { useState, useRef, useEffect } from "react";
import { ShareCardTemplate } from "@/components/quiz/ShareCardTemplate";
import { toBlob } from "html-to-image";

export default function DevShareCardPreview() {
  const [percentage, setPercentage] = useState(75);
  const [isRedFlag, setIsRedFlag] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  
  // This route should only be accessible in development mode.
  // In a real app, Next.js will typically not bundle dev-only pages if configured correctly,
  // but we can add a runtime check just to be safe.
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <h1>404 - Not Found</h1>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!scoreCardRef.current) {
      setGenerationError("Ref is null. DOM not attached.");
      return;
    }
    
    // html-to-image has a known bug where it miscalculates bounding boxes
    // of elements inside CSS-scaled containers. We temporarily remove the scale.
    const container = scoreCardRef.current.parentElement;
    const originalTransform = container ? container.style.transform : "";
    if (container) {
      container.style.transform = "none";
    }

    // Give the browser a frame to apply the transform change
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      setIsGenerating(true);
      setGenerationError(null);
      setGeneratedImageUrl(null);
      
      const blob = await toBlob(scoreCardRef.current, {
        backgroundColor: "#090909",
        cacheBust: true,
        pixelRatio: 1, // Same as actual feature
        skipFonts: false,
      });
      
      if (!blob) throw new Error("toBlob returned null/undefined");

      const url = URL.createObjectURL(blob);
      setGeneratedImageUrl(url);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `redflag-${percentage}-${isRedFlag ? "red-flag" : "green-flag"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // We don't revoke here because we want to show it in the UI.
    } catch (e: any) {
      console.error("Failed to generate image preview:", e);
      setGenerationError(e?.message || String(e));
    } finally {
      setIsGenerating(false);
      // Restore transform
      if (container) {
        container.style.transform = originalTransform;
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col md:flex-row gap-8 items-start">
      {/* Control Panel */}
      <div className="bg-neutral-950 p-6 rounded-xl border border-white/10 w-full md:w-80 flex flex-col gap-6 shrink-0 sticky top-8">
        <div>
          <h2 className="text-xl font-bold mb-1">SHARE CARD PREVIEW</h2>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">Development Only</p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-neutral-300">Result Variant</label>
          <div className="flex gap-2">
            <button 
              onClick={() => { setIsRedFlag(false); setPercentage(75); }}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!isRedFlag ? 'bg-green-500 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              GREEN FLAG
            </button>
            <button 
              onClick={() => { setIsRedFlag(true); setPercentage(42); }}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${isRedFlag ? 'bg-red-500 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              RED FLAG
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-neutral-300 flex justify-between">
            <span>Score Percentage</span>
            <span className="text-white font-mono">{percentage}%</span>
          </label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={percentage} 
            onChange={(e) => setPercentage(parseInt(e.target.value))}
            className="w-full accent-white"
          />
        </div>

        <div className="h-[1px] bg-white/10 w-full my-2" />

        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate & Download Image"}
        </button>

        {generationError && (
          <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-xs text-red-400 font-bold mb-1">ERROR:</p>
            <p className="text-xs text-red-200 break-words">{generationError}</p>
          </div>
        )}
        
        {generatedImageUrl && (
          <div className="flex flex-col gap-2 mt-4">
            <p className="text-xs text-green-400 font-bold">GENERATED OUTPUT:</p>
            <div className="w-full aspect-[9/16] bg-black border border-green-500/30 rounded-lg overflow-hidden relative">
              <img src={generatedImageUrl} alt="Generated Preview" className="w-full h-full object-contain" />
            </div>
            <p className="text-[10px] text-neutral-500 text-center">If this is blank, the capture failed.</p>
          </div>
        )}

        <p className="text-xs text-neutral-500 text-center mt-4">
          Image Dimensions: 1080 × 1920 (9:16)<br/>
          DOM Node: {scoreCardRef.current ? "Rendered & Attached" : "Not Attached"}
        </p>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full overflow-hidden bg-black rounded-xl border border-white/5 relative" style={{ minHeight: "80vh" }}>
        {/* We use scale to fit the 1080x1920 card into the viewport nicely */}
        <div className="relative" style={{ width: 1080, height: 1920, transform: 'scale(0.35)', transformOrigin: 'top center', marginBottom: '-1200px' }}>
          {/* The actual reusable template component, rendered exactly how it will be snapshotted */}
          <ShareCardTemplate 
            ref={scoreCardRef} 
            percentage={percentage} 
            isRedFlag={isRedFlag} 
          />
        </div>
      </div>
    </div>
  );
}
