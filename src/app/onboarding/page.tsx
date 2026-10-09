"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, User, Users, Sparkles, Heart, MessageCircle, HeartHandshake, MoreHorizontal } from "lucide-react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState(21);

  const [taker, setTaker] = useState<"myself" | "partner" | "curious" | null>(null);
  const [relationshipStatus, setRelationshipStatus] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const router = useRouter();

  const handleNext = () => {
    setIsExiting(true);
    setDirection("forward");
    setTimeout(() => {
      if (step < 5) setStep(step + 1);
      else {
        router.push("/test");
      }
      setIsExiting(false);
    }, 400);
  };

  const handleBack = () => {
    if (step > 1) {
      setIsExiting(true);
      setDirection("backward");
      setTimeout(() => {
        setStep(step - 1);
        setIsExiting(false);
      }, 400);
    }
  };

  const canContinue =
    step === 1
      ? name.trim().length > 0
      : step === 2
        ? true
        : step === 3
          ? Boolean(taker)
          : step === 4
            ? Boolean(relationshipStatus)
            : true;

  return (
    <div className="bg-[#0a0a0a] min-h-[100dvh] w-full flex justify-center">
      <div className="relative h-[100dvh] w-full max-w-[430px] overflow-hidden flex flex-col px-6 [padding-top:var(--app-top-inset)] [padding-bottom:var(--app-bottom-inset)] shadow-2xl shadow-black/50 bg-black">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Cozy room with window"
            fill
            priority
            className={`object-cover transition-opacity duration-1000 ${step === 5 ? 'opacity-0' : 'opacity-90'}`}
          />
          <Image
            src="/night-bg.jpg"
            alt="Night view"
            fill
            priority
            className={`object-cover transition-opacity duration-1000 ${step === 5 ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Subtle gradient overlay to darken the background similar to the main page */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95" />
          {/* Extra dark radial glow specifically behind the left text area for readability */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,_rgba(0,0,0,0.6)_0%,_transparent_50%)]" />
        </div>

        {/* Top Navigation */}
        {step < 5 && (
          <div className="relative z-10 flex items-center justify-between mb-4 px-2">
            {step === 1 ? (
              <Link href="/" className="p-2 -ml-2 text-white hover:text-white/70 transition-colors">
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </Link>
            ) : (
              <button onClick={handleBack} className="p-2 -ml-2 text-white hover:text-white/70 transition-colors">
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
            )}
            
            <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/90">
              A Kinder You
            </div>

            <div className="flex flex-col items-end gap-2 pr-1">
              <span className="text-white/90 text-[10px] tracking-[0.2em] font-medium">
                0{step} / 05
              </span>
              {/* Progress bar container */}
              <div className="w-12 h-[1.5px] bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={`relative z-10 flex-1 min-h-0 flex flex-col transition-all duration-400 ease-in-out overflow-y-auto pb-[100px] ${isExiting ? (direction === 'forward' ? '-translate-x-8 opacity-0' : 'translate-x-8 opacity-0') : 'translate-x-0 opacity-100'}`}>
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col flex-1 px-2">
              <div className="mb-8 mt-0">
                <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/90 mb-3">
                  Let&apos;s start<br/>with you
                </h3>
                <div className="w-6 h-[1.5px] bg-white" />
              </div>

              <h1 className="font-juana text-[44px] sm:text-5xl text-white font-normal mb-4 leading-[1.1] tracking-tight drop-shadow-lg" >
                What is<br/>
                <span className="whitespace-nowrap">
                  <span className="italic text-[#eedbc2]">your</span> name?
                </span>
              </h1>
              <p className="text-white/80 text-base mb-12 font-light tracking-wide">
                Let&apos;s get to know you better.
              </p>
              
              <div className="mt-4 flex flex-col w-full animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both" style={{ animationDelay: '200ms' }}>
                <div className="relative flex items-center w-full bg-[#1c1a17]/60 border border-white/20 rounded-full px-5 py-4 backdrop-blur-md transition-colors focus-within:border-white/50 focus-within:bg-[#1c1a17]/80 shadow-inner">
                  <User className="w-5 h-5 text-white/60 mr-3 flex-shrink-0" strokeWidth={1.5} />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-transparent text-white text-lg placeholder:text-white/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col flex-1 px-2">
              <div className="mb-8 mt-0">
                <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/90 mb-3">
                  Getting to know you
                </h3>
              </div>

              <h1 className="font-juana text-[44px] sm:text-5xl text-white font-normal mb-4 leading-[1.1] tracking-tight drop-shadow-lg" >
                How old<br/>
                <span className="italic text-[#eedbc2]">are you?</span>
              </h1>
              <p className="text-white/80 text-base mb-12 font-light tracking-wide">
                Just so we can keep<br/>the questions relevant.
              </p>
              
              <div className="mt-2 mb-8 flex flex-col items-center w-full">
                <div 
                  className="font-juana text-[88px] sm:text-[110px] leading-none text-white drop-shadow-lg font-normal tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                  style={{ animationDelay: '100ms' }}
                >
                  {age}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/70 mb-6 font-medium animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both" style={{ animationDelay: '150ms' }}>
                  years old
                </div>
                
                <div className="w-full relative px-2 py-4 animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both" style={{ animationDelay: '250ms' }}>
                  <input 
                    type="range" 
                    min="13" 
                    max="60" 
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full appearance-none h-[4px] rounded-full cursor-pointer focus:outline-none
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 
                      [&::-webkit-slider-thumb]:bg-[#eedbc2] [&::-webkit-slider-thumb]:rounded-full 
                      [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:mt-[-12px]
                      [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:h-[4px] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:rounded-full"
                    style={{
                      background: `linear-gradient(to right, #eedbc2 ${((age - 13) / (60 - 13)) * 100}%, rgba(255,255,255,0.2) ${((age - 13) / (60 - 13)) * 100}%)`
                    }}
                  />
                  
                  <div className="flex justify-between mt-4 text-white/70 text-sm font-medium">
                    <span>13</span>
                    <span>60</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col flex-1 px-2 relative">
              {/* Floating right text */}
              <div className="absolute top-8 -right-2 text-[8px] leading-[1.6] tracking-[0.2em] text-white/60 text-left uppercase hidden sm:block">
                DIFFERENT<br/>PEOPLE<br/>BRIGHTER<br/>PERSPECTIVES
                <div className="w-4 h-[1px] bg-white/40 mt-3" />
              </div>

              <div className="mb-8 mt-0">
                <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/90 mb-3">
                  Getting to know you
                </h3>
              </div>

              <h1 className="font-juana text-[44px] sm:text-5xl text-white font-normal mb-4 leading-[1.1] tracking-tight drop-shadow-lg" >
                Who&apos;s taking<br/>
                <span className="italic text-[#eedbc2]">the test?</span>
              </h1>
              <p className="text-white/80 text-base mb-10 font-light tracking-wide">
                Your answers help us personalize<br/>your experience.
              </p>
              
              <div className="flex flex-col mt-2 mb-24 relative z-20">
                {[
                  { id: 'self', label: 'FOR MYSELF', sub: 'I want to know myself better' },
                  { id: 'partner', label: 'FOR MY PARTNER', sub: "Let's grow together" },
                  { id: 'curious', label: 'JUST CURIOUS', sub: 'Exploring for now' }
                ].map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => setTaker(option.id as "myself" | "partner" | "curious")}
                    className={`animate-in fade-in slide-in-from-bottom-6 fill-mode-both w-full flex items-center py-5 border-b border-white/10 transition-all duration-300 text-left group
                      ${taker === option.id ? 'opacity-100 translate-x-2' : 'opacity-75 hover:opacity-100 hover:translate-x-2 hover:border-white/30'}`}
                    style={{ animationDelay: `${index * 100 + 200}ms`, animationDuration: '500ms' }}
                  >
                    <span className={`text-[10px] tracking-[0.2em] font-medium mr-6 transition-colors duration-300 ${taker === option.id ? 'text-[#eedbc2] opacity-100' : 'opacity-60 group-hover:text-[#eedbc2] group-hover:opacity-100'}`}>0{index + 1}</span>
                    <div className="flex flex-col flex-1 transition-all duration-300">
                      <span className={`text-[15px] sm:text-base mb-1 tracking-[0.1em] transition-all duration-300 ${taker === option.id ? 'text-[#eedbc2] font-bold drop-shadow-[0_0_8px_rgba(238,219,194,0.5)]' : 'text-white font-medium group-hover:font-bold group-hover:text-[#eedbc2] group-hover:drop-shadow-[0_0_8px_rgba(238,219,194,0.5)]'}`}>{option.label}</span>
                      <span className={`text-[13px] font-light transition-colors duration-300 ${taker === option.id ? 'text-[#eedbc2]/80' : 'text-white/60 group-hover:text-[#eedbc2]/90'}`}>{option.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col flex-1 px-2 relative">
              <div className="mb-8 mt-0">
                <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/90 mb-3">
                  Getting to know you
                </h3>
              </div>

              <h1 className="font-juana text-[44px] sm:text-5xl text-white font-normal mb-4 leading-[1.1] tracking-tight drop-shadow-lg" >
                What&apos;s your<br/>relationship <span className="italic text-[#eedbc2]">status?</span>
              </h1>
              <p className="text-white/80 text-base mb-10 font-light tracking-wide">
                This helps us show you people<br/>who match where you are in life.
              </p>
              
              <div className="flex flex-col mt-2 mb-24 relative z-20">
                {[
                  { id: 'single', label: 'SINGLE', sub: 'Open to meeting new people' },
                  { id: 'talking', label: 'TALKING', sub: 'Getting to know someone' },
                  { id: 'dating', label: 'DATING', sub: 'Seeing someone' },
                  { id: 'relationship', label: 'IN A RELATIONSHIP', sub: 'Committed and happy' },
                  { id: 'complicated', label: "IT'S COMPLICATED", sub: "It's a long story" }
                ].map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setRelationshipStatus(option.label);
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('redflag_relationship', option.label);
                      }
                    }}
                    className={`animate-in fade-in slide-in-from-bottom-6 fill-mode-both w-full flex items-center py-5 border-b border-white/10 transition-all duration-300 text-left group
                      ${relationshipStatus === option.label ? 'opacity-100 translate-x-2' : 'opacity-75 hover:opacity-100 hover:translate-x-2 hover:border-white/30'}`}
                    style={{ animationDelay: `${index * 80 + 200}ms`, animationDuration: '500ms' }}
                  >
                    <span className={`text-[10px] tracking-[0.2em] font-medium mr-6 transition-colors duration-300 ${relationshipStatus === option.label ? 'text-[#eedbc2] opacity-100' : 'opacity-60 group-hover:text-[#eedbc2] group-hover:opacity-100'}`}>0{index + 1}</span>
                    <div className="flex flex-col flex-1 transition-all duration-300">
                      <span className={`text-[15px] sm:text-base mb-1 tracking-[0.1em] transition-all duration-300 ${relationshipStatus === option.label ? 'text-[#eedbc2] font-bold drop-shadow-[0_0_8px_rgba(238,219,194,0.5)]' : 'text-white font-medium group-hover:font-bold group-hover:text-[#eedbc2] group-hover:drop-shadow-[0_0_8px_rgba(238,219,194,0.5)]'}`}>{option.label}</span>
                      <span className={`text-[13px] font-light transition-colors duration-300 ${relationshipStatus === option.label ? 'text-[#eedbc2]/80' : 'text-white/60 group-hover:text-[#eedbc2]/90'}`}>{option.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-[1500ms] flex flex-col flex-1 px-4 items-center relative pt-2">
              <button 
                onClick={handleBack} 
                className="absolute top-4 left-0 p-2 text-white hover:text-white/70 transition-colors z-50"
              >
                <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>

              <div className="mt-6 mb-8 text-white/80 font-medium tracking-[0.2em] text-sm opacity-90 drop-shadow-md">
                05 / 05
              </div>
              
              <div className="w-full text-left mt-8">
                <h1 
                  className="font-juana text-[60px] sm:text-7xl text-white font-normal mb-6 tracking-tight leading-none" 
                  style={{ textShadow: "0px 4px 24px rgba(0,0,0,0.9), 0px 2px 8px rgba(0,0,0,0.8)" }}
                >
                  Last thing...
                </h1>
                <p 
                  className="text-white text-[20px] sm:text-[24px] font-medium tracking-wide leading-[1.6] max-w-sm"
                  style={{ textShadow: "0px 4px 16px rgba(0,0,0,0.9), 0px 2px 6px rgba(0,0,0,0.9)" }}
                >
                  Be honest. There are no right<br/>
                  or wrong answers — only<br/>
                  perspectives.
                </p>
              </div>

              <div className="mt-auto mb-[7.5rem] flex justify-center w-full relative">
                <div className="font-alex-brush text-6xl sm:text-7xl text-white/90 -rotate-3 tracking-wide drop-shadow-xl animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
                  Ready?
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Button (Fixed CTA) */}
        <div 
          className={`absolute inset-x-0 z-50 pointer-events-none flex justify-center px-6 transition-all duration-400 ease-in-out ${isExiting ? 'translate-y-8 opacity-0' : 'translate-y-0 opacity-100'}`}
          style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
        >
          <div className="w-full pointer-events-auto flex justify-center">
            {step < 5 ? (
              <button 
                onClick={handleNext}
                disabled={!canContinue}
                className={`animate-in fade-in slide-in-from-bottom-4 duration-300 flex items-center justify-center gap-2 w-full max-w-[340px] rounded-full py-4 font-semibold text-lg transition-all ${
                  canContinue
                    ? 'bg-gradient-to-r from-[#eedbc2] to-[#e4cbad] hover:brightness-105 !text-black shadow-[0_8px_30px_rgba(238,219,194,0.25)] hover:duration-300 hover:ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-100 active:translate-y-0'
                    : 'bg-white/15 !text-white/45 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both flex items-center justify-center gap-3 w-full max-w-[340px] bg-black/40 backdrop-blur-xl border border-white/40 hover:bg-white/20 hover:border-white/60 !text-white rounded-[32px] py-4 font-medium text-lg transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:duration-300 hover:ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 active:scale-100 active:translate-y-0"
              >
                Start
                <ArrowRight className="w-5 h-5 text-white/80" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
