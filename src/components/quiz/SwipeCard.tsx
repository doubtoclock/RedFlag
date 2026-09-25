"use client";

import { motion, useMotionValue, useTransform, PanInfo, animate } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Flag } from "lucide-react";

interface SwipeCardProps {
  card: { id: number; image: string; text: string; subtext: string };
  index: number;
  isActive: boolean;
  onSwipe: (direction: "left" | "right") => void;
  isTransitioning: boolean;
}

export function SwipeCard({ card, index, isActive, onSwipe, isTransitioning }: SwipeCardProps) {
  const x = useMotionValue(0);
  
  // Drag physics as requested
  const rotate = useTransform(x, (currentX) => currentX * 0.06);
  const dragScale = useTransform(x, (currentX) => 1 - Math.min(Math.abs(currentX) / 2000, 0.03));
  
  // Swipe intent indicators
  const redOpacity = useTransform(x, (currentX) => Math.min(Math.abs(Math.min(currentX, 0)) / 120, 1));
  const greenOpacity = useTransform(x, (currentX) => Math.min(Math.max(currentX, 0) / 120, 1));

  const [hasSwiped, setHasSwiped] = useState(false);

  // External trigger for buttons/keyboard
  useEffect(() => {
    if (!isActive || isTransitioning || hasSwiped) return;
    
    const handleTriggerSwipe = (e: Event) => {
      const direction = (e as CustomEvent).detail;
      setHasSwiped(true);
      animate(x, direction === "left" ? -800 : 800, { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] });
      onSwipe(direction);
    };

    window.addEventListener("triggerSwipe", handleTriggerSwipe);
    return () => window.removeEventListener("triggerSwipe", handleTriggerSwipe);
  }, [isActive, isTransitioning, hasSwiped, onSwipe, x]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isTransitioning || hasSwiped) return;

    const threshold = 100;
    const velocityThreshold = 400;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset < -threshold || velocity < -velocityThreshold) {
      setHasSwiped(true);
      animate(x, -800, { duration: 0.3, ease: "easeOut" });
      onSwipe("left");
    } else if (offset > threshold || velocity > velocityThreshold) {
      setHasSwiped(true);
      animate(x, 800, { duration: 0.3, ease: "easeOut" });
      onSwipe("right");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 m-auto w-full max-w-[390px] h-[calc(100%-1.5rem)] max-h-[620px]"
      style={{ zIndex: 10 - index }}
      initial={{ scale: 0.94, y: 18, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.94, 
        y: isActive ? 0 : 18,
        opacity: hasSwiped ? 0 : 1,
        filter: index > 0 ? "blur(4px)" : "blur(0px)"
      }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 14 }}
    >
      <motion.div
        drag={isActive && !isTransitioning ? "x" : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        style={{ x, rotate, scale: dragScale }}
        className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing bg-[rgba(10,10,10,0.6)]"
      >
        <Image
          src={card.image}
          alt="Question background"
          fill
          priority={isActive}
          className="object-cover pointer-events-none opacity-90 mix-blend-luminosity"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(10,10,10,0.4)] to-[rgba(10,10,10,0.95)] pointer-events-none" />

        {/* Indicators */}
        <motion.div 
          style={{ opacity: redOpacity }}
          className="absolute top-8 right-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-md"
        >
          <Flag className="w-4 h-4 text-red-500 fill-current" />
          <span className="text-red-500 font-bold tracking-widest text-xs">RED FLAG</span>
        </motion.div>

        <motion.div 
          style={{ opacity: greenOpacity }}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/50 backdrop-blur-md"
        >
          <Flag className="w-4 h-4 text-green-500 fill-current" />
          <span className="text-green-500 font-bold tracking-widest text-xs">GREEN FLAG</span>
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 pointer-events-none">
          <h2 className="font-juana text-white text-[32px] sm:text-4xl leading-[1.1] font-normal drop-shadow-xl tracking-tight mb-3">
            {card.text}
          </h2>
          <div className="w-6 h-[1px] bg-white/40 mt-3" />
        </div>
      </motion.div>
    </motion.div>
  );
}
