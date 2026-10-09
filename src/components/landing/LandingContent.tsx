"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PrivacyModal } from "@/components/legal/PrivacyModal";
import { TermsModal } from "@/components/legal/TermsModal";

export default function LandingContent() {
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  const router = useRouter();

  return (
    <>
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      
      {/* Main Title Area */}
      <div className="relative z-10 px-8 mt-[9vh] sm:mt-[12vh]">
        <h1 
          className="font-juana text-7xl sm:text-8xl font-normal leading-[0.92] pt-[0.08em] tracking-tight drop-shadow-2xl text-gradient-g inline-block animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
          style={{ animationDelay: '300ms' }}
        >
          RED<br/>FLAG
        </h1>
        
        <div className="mt-8">
          <p className="font-sans text-xs sm:text-sm font-light leading-[1.8] tracking-[0.2em] text-white/90 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both uppercase" style={{ animationDelay: '500ms' }}>
            Same people.<br/>
            Different perspectives.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-auto flex flex-col items-center px-6 [padding-bottom:var(--app-bottom-inset)]">
        <div className="w-full max-w-[280px] mb-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '600ms' }}>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-white/40 rounded bg-white/5 group-hover:border-white/70 transition-colors flex-shrink-0">
              <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} />
              {agreedPrivacy && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-[11px] text-white/70 select-none">
              I agree to the <button onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }} className="text-white underline hover:text-white/80 transition-colors">Privacy Policy</button>
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-white/40 rounded bg-white/5 group-hover:border-white/70 transition-colors flex-shrink-0">
              <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)} />
              {agreedTerms && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-[11px] text-white/70 select-none">
              I agree to the <button onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-white underline hover:text-white/80 transition-colors">Terms & Conditions</button>
            </span>
          </label>
        </div>

        <button 
          onClick={() => {
            if (agreedPrivacy && agreedTerms) router.push('/onboarding');
          }}
          disabled={!agreedPrivacy || !agreedTerms}
          className={`flex items-center justify-center gap-3 w-full max-w-[280px] rounded-full py-4 font-medium text-[15px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both 
            ${(agreedPrivacy && agreedTerms) 
              ? "bg-transparent border border-white/30 hover:bg-white/20 hover:border-white/60 text-white shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:-translate-y-2 hover:scale-[1.05]" 
              : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"}`}
          style={{ animationDelay: '700ms' }}
        >
          Let's Begin
          <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
}
