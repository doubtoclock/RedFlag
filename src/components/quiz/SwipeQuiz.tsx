"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flag } from "lucide-react";
import { SwipeCard } from "./SwipeCard";
import { FlagReveal } from "./FlagReveal";
import { SwipeControls } from "./SwipeControls";
import { QuizResults } from "./QuizResults";

interface Question {
  id: number;
  image: string;
  text: string;
  subtext: string;
  type: "red" | "green";
}

interface SwipeQuizProps {
  questions: Question[];
}

export function SwipeQuiz({ questions }: SwipeQuizProps) {
  const router = useRouter();
  const [cards, setCards] = useState<Question[]>([]);
  const [results, setResults] = useState<{ id: number; flag: "red" | "green"; correctFlag: "red" | "green" }[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [revealType, setRevealType] = useState<"red" | "green" | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loadingText, setLoadingText] = useState("Checking your instincts...");
  const [totalSelected, setTotalSelected] = useState(20);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    // Initial random selection
    if (cards.length === 0 && !showResults && results.length === 0) {
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 20);
      setCards(selected);
      setTotalSelected(selected.length);
    }
  }, [questions, cards.length, showResults, results.length]);

  useEffect(() => {
    if (cards.length === 0 && results.length > 0 && !showResults) {
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1000); // 1 second total wait
      
      return () => clearTimeout(timer);
    }
  }, [cards.length, showResults, results.length]);

  const handleSwipe = (direction: "left" | "right", cardId: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const flagType = direction === "left" ? "red" : "green";
    const currentCard = cards.find(c => c.id === cardId)!;
    setResults((prev) => [...prev, { id: cardId, flag: flagType, correctFlag: currentCard.type }]);

    // 0ms: Card starts exiting (takes ~300ms)
    // 250ms: Flag reveals (takes ~250ms)
    setTimeout(() => {
      setRevealType(flagType);
    }, 250);

    // 500ms: Flag holds
    // 750ms: Flag exits, next card scales up (takes ~300ms)
    setTimeout(() => {
      setRevealType(null);
      setCards((prev) => prev.slice(1));
    }, 750);

    // 1050ms: Transition complete
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1050);
  };

  const isComplete = cards.length === 0 && results.length === totalSelected && totalSelected > 0;
  const backgroundTint = revealType === "red" ? "bg-[#3d1a16]/60 backdrop-sepia-[.2]" : revealType === "green" ? "bg-[#173822]/60 backdrop-saturate-150" : "bg-transparent";
  
  // Calculate Progress
  const totalQuestions = totalSelected || 20;
  const currentQuestionIndex = Math.min(totalQuestions - cards.length + 1, totalQuestions);

  return (
    <>
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-xl px-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center max-w-md w-full relative"
            >
              <div className="flex w-full items-center justify-center gap-10 sm:gap-16 mb-12">
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-red-500/30 bg-red-500/10 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                    <Flag className="w-6 h-6 sm:w-8 sm:h-8 text-red-500/90 fill-current ml-0.5" />
                  </div>
                  <span className="text-white/60 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">Swipe Left</span>
                </div>
                
                <div className="flex flex-col items-center gap-4 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }}>
                    <Flag className="w-6 h-6 sm:w-8 sm:h-8 text-green-500/90 fill-current ml-0.5" />
                  </div>
                  <span className="text-white/60 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase">Swipe Right</span>
                </div>
              </div>

              <h2 className="font-juana text-[40px] sm:text-5xl text-white mb-6 leading-[1.1] tracking-tight drop-shadow-xl">
                Trust your <span className="text-[#eedbc2] italic">instincts</span>
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-12 font-light tracking-wide leading-relaxed">
                Swipe <span className="text-red-400 font-semibold drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]">left</span> for a red flag,<br/>and <span className="text-green-400 font-semibold drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">right</span> for a green flag.
              </p>

              <button 
                onClick={() => setShowTutorial(false)}
                className="group relative px-12 py-4 bg-gradient-to-r from-[#eedbc2] to-[#e4cbad] hover:brightness-105 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_10px_40px_rgba(238,219,194,0.4)] active:scale-95"
              >
                I'm Ready
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Blurred Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {cards.length > 0 && (
            <motion.div
              key={cards[0].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={cards[0].image}
                alt=""
                fill
                priority
                className="object-cover blur-[50px] scale-[1.2]"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Dynamic Tint Overlay based on Flag Reveal */}
      {!isComplete && (
        <motion.div 
          className={`absolute inset-0 z-40 pointer-events-none transition-colors duration-500 ${backgroundTint}`} 
        />
      )}

      {/* Top Navigation */}
      {!isComplete && (
        <div className="relative z-10 flex items-center justify-between mb-8">
          <Link href="/onboarding" className="p-2 -ml-2 text-white hover:text-white/70 transition-colors">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </Link>
          <div className="font-sans text-white/90 tracking-[0.2em] text-[11px] font-medium absolute left-1/2 -translate-x-1/2 uppercase drop-shadow-md">
            THE TEST
          </div>
          <div className="flex flex-col items-end gap-1.5 pt-1">
            <span className="text-white/80 text-[10px] tracking-[0.2em] font-medium">
              {currentQuestionIndex < 10 ? `0${currentQuestionIndex}` : currentQuestionIndex} / {totalQuestions}
            </span>
            <div className="w-16 h-[2px] bg-white/20 flex overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cards Container & Results */}
      <div className="relative flex-1 w-full flex items-center justify-center perspective-[1000px] pb-10">
        <AnimatePresence>
          {!isComplete && (
            <>
              {cards.map((card, index) => {
                if (index > 2) return null;
                return (
                  <SwipeCard
                    key={card.id}
                    card={card}
                    index={index}
                    isActive={index === 0}
                    isTransitioning={isTransitioning}
                    onSwipe={(direction) => handleSwipe(direction, card.id)}
                  />
                );
              })} 
            </>
          )}
        </AnimatePresence>
        
        {!isComplete && (
          <AnimatePresence>
            <FlagReveal key="flag-reveal" revealType={revealType} />
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {isComplete && !showResults && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            <h2 className="font-juana text-white text-[28px] tracking-wide mb-6">Reading your choices...</h2>
            
            <div className="w-32 h-[2px] bg-white/20 overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-white/60 font-sans text-xs tracking-[0.2em] uppercase font-medium text-center px-6"
              >
                {loadingText}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && (
          <QuizResults 
            key="results"
            results={results}
            onRetake={() => {
              router.push("/onboarding");
            }}
          />
        )}
      </AnimatePresence>

      <SwipeControls 
        isVisible={!isComplete} 
        isTransitioning={isTransitioning} 
        showInstructions={currentQuestionIndex === 1}
      />
    </>
  );
}
