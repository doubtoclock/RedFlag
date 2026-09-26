"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Show splash screen for exactly 3 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0%,rgba(10,10,10,1)_70%)] opacity-80" />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex flex-col items-center justify-center z-10"
          >
            {/* Waving Flag Animation Container */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 drop-shadow-[0_0_40px_rgba(239,68,68,0.3)]">
              <motion.div
                animate={{ 
                  rotateZ: [-2, 3, -2],
                  y: [-3, 3, -3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image 
                    src="/red-flag.png" 
                    alt="Red Flag" 
                    fill 
                    className="object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                    priority
                  />
                  {/* Glass shimmer sweep effect over the flag */}
                  <motion.div 
                    animate={{ x: ["-200%", "300%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] skew-x-[-20deg]"
                  />
                </div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-juana text-[42px] sm:text-5xl tracking-widest text-white drop-shadow-xl"
            >
              RED FLAG
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/50 mt-4"
            >
              Kinder Relationships
            </motion.p>
          </motion.div>
          
          {/* Bottom Loading Bar */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "linear" }}
              className="h-full bg-gradient-to-r from-transparent via-red-500/80 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
