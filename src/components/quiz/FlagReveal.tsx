"use client";

import { motion } from "framer-motion";
import { Flag } from "lucide-react";

interface FlagRevealProps {
  revealType: "red" | "green" | null;
}

export function FlagReveal({ revealType }: FlagRevealProps) {
  if (!revealType) return null;

  const isRed = revealType === "red";
  
  const iconColor = isRed ? "text-red-500" : "text-green-500";
  const title = isRed ? "RED FLAG" : "GREEN FLAG";
  const subtitle = isRed ? "Not for everyone." : "That's a good sign.";
  
  const iconVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.div
        variants={iconVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex flex-col items-center"
      >
        <Flag className={`w-8 h-8 mb-4 fill-current ${iconColor}`} />
        
        <h3 className={`font-juana text-4xl tracking-wide mb-3 ${iconColor} drop-shadow-md`}>
          {title}
        </h3>
        <p className="text-white/80 font-sans tracking-[0.2em] text-[10px] uppercase font-medium">
          {subtitle}
        </p>
      </motion.div>
    </motion.div>
  );
}
