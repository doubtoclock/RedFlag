"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./SplashScreen.module.css";

const FLAG_IMAGES = [
  "/splash/cloth-red.webp",
  "/splash/cloth-green.webp",
  "/splash/pole.webp",
];
const REEL_VALUES = ["00", "14", "73", "36", "91", "58", "22", "85", "47", "?"];

// Never let a slow network hold the splash back for longer than this
const ASSET_TIMEOUT_MS = 2500;
// The animation lands at 3s; hold the final frame briefly before leaving
const SPLASH_DURATION_MS = 3500;

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const decodeFlag = (src: string) => {
      const image = new window.Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    };
    const timeout = new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT_MS));

    let cancelled = false;
    Promise.race([
      Promise.all([...FLAG_IMAGES.map(decodeFlag), document.fonts.ready]),
      timeout,
    ]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setShow(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`${styles.splash} ${ready ? "" : styles.waiting}`}
        >
          <div className={styles.phone}>
          <div className={styles.stage}>
            <div className={`${styles.side} ${styles.redSide}`} aria-hidden="true">
              <div className={styles.frame}>
                <div className={`${styles.flag} ${styles.cloth}`}>
                  <Image src="/splash/cloth-red.webp" alt="" width={1024} height={1024} className={styles.flagImage} preload />
                </div>
              </div>
            </div>

            <div className={`${styles.side} ${styles.greenSide}`} aria-hidden="true">
              <div className={styles.frame}>
                <div className={`${styles.flag} ${styles.cloth}`}>
                  <Image src="/splash/cloth-green.webp" alt="" width={1024} height={1024} className={styles.flagImage} preload />
                </div>
              </div>
            </div>

            <div className={styles.frame}>
              <div className={styles.baseShadow} aria-hidden="true" />
              <div className={styles.flag} aria-hidden="true">
                <Image src="/splash/pole.webp" alt="" width={1024} height={1024} className={styles.flagImage} preload />
              </div>

              <h1 className={`font-juana ${styles.wordmark}`}>
                <span className={styles.right}>RED</span>{" "}
                <span className={styles.left}>FLAG</span>
              </h1>

              <p className={`font-sans ${styles.tagline}`}>Kinder Relationships</p>

              <div className={`font-juana ${styles.score}`} aria-hidden="true">
                <div className={`${styles.reelWindow} ${styles.right}`}>
                  <div className={styles.reel}>
                    {REEL_VALUES.map((value) => (
                      <div key={value}>{value}</div>
                    ))}
                  </div>
                </div>
                <div className={`${styles.percent} ${styles.left}`}>%</div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
