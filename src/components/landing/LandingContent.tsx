import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingContent() {
  return (
    <>
      {/* Main Title Area */}
      <div className="relative z-10 px-8 mt-[15vh]">
        <h1 
          className="font-juana text-7xl sm:text-8xl font-normal leading-[0.85] tracking-tight drop-shadow-2xl text-gradient-g inline-block animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
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
      <div className="relative z-10 mt-auto flex flex-col items-center px-6 pb-20">
        <Link 
          href="/onboarding" 
          className="flex items-center justify-center gap-3 w-full max-w-[280px] bg-transparent border border-white/30 hover:bg-white/10 text-white rounded-full py-4 font-medium text-[15px] transition-all hover:scale-[1.02] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
          style={{ animationDelay: '700ms' }}
        >
          Let's Begin
          <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
        </Link>
      </div>
    </>
  );
}
