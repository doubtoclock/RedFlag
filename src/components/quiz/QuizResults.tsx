"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, Send, Copy, RefreshCw, Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface QuizResultsProps {
  results: { id: number; flag: "red" | "green"; correctFlag: "red" | "green" }[];
  onRetake: () => void;
}

type RelationshipStatus = "SINGLE" | "TALKING" | "DATING" | "IN A RELATIONSHIP" | "IT'S COMPLICATED";
type ScoreTier = "HIGH" | "GOOD" | "AVERAGE" | "LOW";

const MESSAGES = {
  "SINGLE": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Wow… you're actually TOO good at this. How are you still single? 😭💚", share: "\"Send this to your crush. Maybe today is finally your day 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okayyy, you know your red flags… now you just need someone to test them on. 👀", share: "\"Share this with your friends and let them explain why you're still single 😂\"" },
    "AVERAGE": { expertTitle: "MIXED SIGNALS", result: "You can identify red flags… sometimes. Your love life might need a few updates. 💀", share: "\"Send this to your single friends. Someone needs to learn 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "No wonder you're still single. You'd probably call a red flag ‘interesting personality.’ 🚩😭", share: "\"Share this with your friends. Maybe they can save your dating life 😂\"" }
  },
  "TALKING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "You’re not just talking… you actually know what you're doing. 👀💚", share: "\"Send this to the person you're talking to. Let’s see if they agree 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "The talking stage is looking promising… just don't ignore the red flags now. 😭", share: "\"Share this with them and see what they score 👀\"" },
    "AVERAGE": { expertTitle: "MIXED SIGNALS", result: "You two are talking… but apparently your red-flag detection isn't. 💀🚩", share: "\"Send this to the person you're talking to. Time for a reality check 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Bro… you're one ‘it's just their personality’ away from disaster. 🚩💀", share: "\"Send this to your talking stage before it's too late 😭\"" }
  },
  "DATING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Okay, you're actually relationship material. Your date picked well. 💚👀", share: "\"Send this to your partner. They deserve to know they picked a Green Flag 💚\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Not bad… your relationship has more Green Flags than questionable decisions. 😂💚", share: "\"Share this with your date and see if they get the same score 👀\"" },
    "AVERAGE": { expertTitle: "MIXED SIGNALS", result: "You're doing okay… but your dating decisions are keeping us slightly concerned. 😭🚩", share: "\"Send this to your date. Let them judge your score 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "We need to talk about your dating choices… because the red flags are basically waving at you. 🚩💀", share: "\"Send this to your date. Let's see if they still want to go on another one 😂\"" }
  },
  "IN A RELATIONSHIP": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Your partner is seriously lucky. You’re basically a walking Green Flag. 💚🏆", share: "\"Send this to your partner so they know how lucky they are 👀❤️\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okay, we approve. Your partner made a pretty good choice. 💚😂", share: "\"Share this with your partner. They need some appreciation today ❤️\"" },
    "AVERAGE": { expertTitle: "MIXED SIGNALS", result: "You're a Green Flag… with a few terms and conditions. 😭💚🚩", share: "\"Send this to your partner and let them decide if they agree 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Your partner deserves a medal for surviving your red flags. 💀🚩", share: "\"Share this with your partner. They deserve to know what they're dealing with 😭\"" }
  },
  "IT'S COMPLICATED": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "It's complicated… but at least YOU aren't the complicated one. 💚😭", share: "\"Send this to the person who makes your relationship complicated 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Your relationship status is complicated, but your Green Flag detection isn't. Respect. 💚", share: "\"Share this with them and maybe finally figure out what's going on 😂\"" },
    "AVERAGE": { expertTitle: "MIXED SIGNALS", result: "Yeah… ‘It's complicated’ suddenly makes a lot more sense. 💀🚩", share: "\"Send this to the person you're ‘complicated’ with 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "It's complicated because apparently neither of you knows what a red flag looks like. 🚩💀", share: "\"Share this with them. Maybe this game can fix what your communication couldn't 😭\"" }
  }
};

export function QuizResults({ results, onRetake }: QuizResultsProps) {
  const [relStatus, setRelStatus] = useState<RelationshipStatus>("SINGLE");
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('redflag_relationship') as RelationshipStatus;
      if (saved && MESSAGES[saved]) {
        setRelStatus(saved);
      }
    }
  }, []);

  const score = results.filter((r) => r.flag === r.correctFlag).length;
  const totalCount = results.length;
  
  const percentage = totalCount > 0 ? Math.round((score / totalCount) * 100) : 0;
  
  useEffect(() => {
    let start = 0;
    const end = percentage;
    if (start === end) return;
    const duration = 700;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [percentage]);
  
  let scoreTier: ScoreTier = "AVERAGE";
  if (percentage === 100) scoreTier = "HIGH";
  else if (percentage >= 75) scoreTier = "GOOD";
  else if (percentage >= 40) scoreTier = "AVERAGE";
  else scoreTier = "LOW";

  const isRedFlag = scoreTier === "LOW";
  const messageData = MESSAGES[relStatus][scoreTier];

  // Dynamic personality title based on score
  let personalityTitle = "FLAG EXPERT";
  if (percentage >= 85) personalityTitle = "FLAG EXPERT";
  else if (percentage >= 65) personalityTitle = "PRETTY AWARE";
  else if (percentage >= 40) personalityTitle = "IT'S COMPLICATED";
  else personalityTitle = "WE NEED TO TALK";

  // Parse message into main title (Juana) and subtitle (Sans)
  let rawMsg = messageData.result;
  let mainPart = rawMsg;
  let subPart = "";
  
  if (rawMsg.includes(". ")) {
    const parts = rawMsg.split(". ");
    subPart = parts.pop() || "";
    mainPart = parts.join(". ") + ".";
  } else if (rawMsg.includes("? ")) {
    const parts = rawMsg.split("? ");
    subPart = parts.pop() || "";
    mainPart = parts.join("? ") + "?";
  } else if (rawMsg.includes("… ")) {
    const parts = rawMsg.split("… ");
    subPart = parts.pop() || "";
    mainPart = parts.join("… ") + "…";
  }

  // Extract the last two words of the main part for coloring
  const words = mainPart.split(" ");
  const lastTwoWords = words.length > 2 ? words.splice(-2).join(" ") : "";
  const firstWords = words.length > 2 ? words.join(" ") : mainPart;

  const theme = {
    gradient: isRedFlag ? "linear-gradient(to bottom, #fca5a5, #ef4444)" : "linear-gradient(to bottom, #e2fbd7, #a1e887)",
    titleColor: isRedFlag ? "text-red-200" : "text-[#c2f2b3]",
    bgImage: "/result-bg.png",
    flagImage: isRedFlag ? "/red-flag.png" : "/green-flag.png",
    title: isRedFlag ? "RED FLAG" : "GREEN FLAG",
    pillText: `YOU'RE ${relStatus}`,
    expertTitle: personalityTitle,
    resultMessage: messageData.result,
    quote: messageData.share,
    primaryBtnBg: isRedFlag ? "bg-gradient-to-r from-red-200 to-red-100 text-black" : "bg-gradient-to-r from-[#dcfce7] to-[#bbf7d0] text-black",
    cardGlow: "shadow-[0_20px_60px_rgba(0,0,0,0.6)]",
    cardBorder: "border-white/10",
    innerCardBg: isRedFlag ? "bg-gradient-to-b from-red-950/40 to-black/40" : "bg-gradient-to-b from-[#102414] to-[#0a150c]",
    innerCardBorder: isRedFlag ? "border-red-500/30" : "border-green-500/30",
    orbitGlow: isRedFlag ? "shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    orbitBorder: isRedFlag ? "border-red-400" : "border-green-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 pointer-events-none bg-black"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-screen h-[100dvh]">
        <Image
          src={theme.bgImage}
          alt="Background"
          fill
          priority
          className="object-cover opacity-80 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 z-10" />
      </div>

      {/* Main Content Container */}
      <div className="absolute inset-0 m-auto flex flex-col w-full max-w-[430px] h-[100dvh] bg-transparent overflow-y-auto overflow-x-hidden font-sans pointer-events-auto pb-6">
        
        {/* Top Header */}
        <div className="relative z-20 w-full flex items-start justify-between p-6 pt-10 flex-shrink-0">
          <div className="flex flex-col gap-6">
            <button onClick={onRetake} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm -ml-1">
              <ArrowLeft className="w-5 h-5" strokeWidth={1} />
            </button>
            <div className="flex flex-col">
              <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-0.5 font-medium">SAME</p>
              <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-0.5 font-medium">PEOPLE.</p>
              <p className="text-[7px] tracking-[0.25em] uppercase text-white font-bold mb-0.5">DIFFERENT</p>
              <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-2 font-medium">PERSPECTIVES.</p>
              <div className="w-6 h-[1px] bg-white/40" />
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end">
            <p className="text-[7px] tracking-[0.25em] uppercase text-white/80 mb-2 font-medium text-right leading-[1.6]">BETTER<br/>PEOPLE<br/>BRIGHTER<br/>DAYS</p>
            <div className="w-6 h-[1px] bg-white/40" />
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-start w-full px-5 -mt-20 sm:-mt-24">
          
          {/* Result Title */}
          <div className="text-center flex flex-col items-center z-10">
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-white mb-0">
              YOUR RESULT
            </p>
            
            {/* Percentage & Flag text */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="flex items-end mt-1">
                <h1 
                  className="font-juana text-[120px] leading-[0.8] tracking-tighter" 
                  style={{ 
                    background: theme.gradient, 
                    WebkitBackgroundClip: 'text', 
                    color: 'transparent' 
                  }}
                >
                  {displayScore}
                </h1>
                <span className="text-[40px] font-juana mb-2" 
                      style={{ 
                        background: theme.gradient, 
                        WebkitBackgroundClip: 'text', 
                        color: 'transparent' 
                      }}>%</span>
              </div>
              <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className={`font-juana text-[42px] leading-[0.9] tracking-wider uppercase drop-shadow-lg`}
                  style={{ 
                    background: theme.gradient, 
                    WebkitBackgroundClip: 'text', 
                    color: 'transparent' 
                  }}>
                {theme.title}
              </motion.h2>
            </div>
          </div>

          {/* 3D Flag Image with orbit */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative w-full max-w-[280px] h-[170px] flex items-center justify-center z-0 mb-6"
          >
            {/* Orbit rings */}
            <div className={`absolute w-[100%] h-[100%] rounded-[100%] border-[0.5px] ${theme.orbitBorder} rotate-[-12deg] scale-y-[0.35] ${theme.orbitGlow}`}></div>
            <div className={`absolute w-[100%] h-[100%] rounded-[100%] border-[0.5px] border-white/20 rotate-[-12deg] scale-y-[0.35]`}></div>
            
            <div className="relative w-[240px] h-[240px] z-10 -mt-8 -ml-4 pointer-events-none">
              <Image 
                src={theme.flagImage} 
                alt={theme.title} 
                fill 
                className={`object-contain ${isRedFlag ? 'drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]'}`}
              />
            </div>
          </motion.div>

          {/* Glass Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className={`w-full rounded-[32px] border ${theme.cardBorder} bg-[#0a0a0a]/60 backdrop-blur-xl px-6 py-8 flex flex-col items-center relative overflow-hidden ${theme.cardGlow} z-20 -mt-10 mb-2`}
            style={{ boxShadow: `0 0 40px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.03)` }}
          >
            
            {/* Top gradient glow inside card (subtle white) */}
            <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.03] to-transparent opacity-100 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Pill badge */}
              <div className={`rounded-full border border-white/20 px-4 py-1.5 flex items-center gap-2 mb-5 bg-transparent`}>
                <Heart className={`w-3.5 h-3.5 ${isRedFlag ? 'text-red-400' : 'text-green-400'}`} strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.2em] font-medium text-white/80 uppercase">{theme.pillText}</span>
              </div>
              
              <p className="text-[10px] tracking-[0.3em] font-light text-white/60 uppercase mb-4 text-center">
                {theme.expertTitle}
              </p>
              
              <h3 className="font-juana text-[26px] sm:text-[30px] leading-[1.2] text-center text-white mb-2 font-medium px-2">
                {firstWords} <br/>
                <span className={theme.titleColor}>{lastTwoWords}</span>
              </h3>
              
              {subPart && (
                <p className="font-sans text-[15px] sm:text-[16px] text-white/90 text-center mb-8 font-light">
                  {subPart}
                </p>
              )}
              
              <div className="w-12 h-[1px] bg-white/20 mb-8" />
              
              {/* Inner Share Card */}
              <div className="w-full flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] tracking-[0.15em] font-medium text-white/90 uppercase">SHARE THIS WITH THEM</span>
                 </div>
                 
                 <div className={`w-full rounded-[20px] border border-white/20 bg-white/5 p-5 relative overflow-hidden backdrop-blur-md flex items-center justify-center`}>
                   <p className="text-[13px] text-white/80 leading-[1.6] whitespace-pre-line font-medium font-sans text-center">
                     {theme.quote}
                   </p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Actions Container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="relative z-20 w-full px-5 pb-8 flex flex-col items-center gap-3 flex-shrink-0 mt-8"
        >
          <button className={`w-full py-4 rounded-[100px] flex items-center justify-center ${theme.primaryBtnBg} hover:opacity-90 transition-opacity font-medium text-[15px]`}>
            <span>Share Result</span> 
            <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2} />
          </button>
          
          <button 
            onClick={() => {
              const challengeText = `I just got ${percentage}% Green Flag. Think you can beat me?\n\nTake the test: https://redflag.test`;
              navigator.clipboard.writeText(challengeText);
              setShowChallengeModal(true);
            }}
            className="w-full py-4 rounded-[100px] border border-white/20 flex items-center justify-center gap-3 text-white bg-[#1a1a1a]/40 backdrop-blur-md hover:bg-white/10 transition-colors font-medium text-[15px]"
          >
            Think they can beat you? <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button onClick={onRetake} className="mt-4 text-[11px] uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white/80 transition-colors">
            Try Again
          </button>
        </motion.div>

        {/* Footer Signature */}
        <div className="relative z-20 w-full px-6 pb-2 flex items-end justify-between flex-shrink-0">
          <div></div>
          
          <div className="text-right flex flex-col items-end">
            <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-0.5 font-medium">KINDER</p>
            <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-0.5 font-medium">RELATIONSHIPS</p>
            <p className="text-[7px] tracking-[0.25em] uppercase text-white/60 mb-2 font-medium">BRIGHTER DAYS</p>
            <div className="w-6 h-[1px] bg-white/40" />
          </div>
        </div>

      </div>

      {/* Challenge Copied Modal */}
      <AnimatePresence>
        {showChallengeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-5 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[320px] bg-[#111] border border-white/10 rounded-[24px] p-6 shadow-2xl flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                <Copy className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white text-[17px] font-medium mb-2 font-sans text-center tracking-wide">Challenge Copied!</h3>
              <p className="text-white/60 text-[13px] text-center font-light mb-6 leading-relaxed">
                Paste the message in your chat to see if they can beat your score.
              </p>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-full py-3.5 rounded-full bg-white text-black font-medium text-[14px] hover:bg-white/90 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
