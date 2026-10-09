"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight, AtSign, Camera, Check, Copy, Heart, Link as LinkIcon, MessageCircle, RefreshCw, Share2, Users, X } from "lucide-react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { toBlob } from "html-to-image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { ShareCardTemplate } from "./ShareCardTemplate";

interface QuizResultsProps {
  results: { id: number; flag: "red" | "green"; correctFlag: "red" | "green" }[];
  onRetake: () => void;
}

type RelationshipStatus = "SINGLE" | "TALKING" | "DATING" | "IN A RELATIONSHIP" | "IT'S COMPLICATED";
type ScoreTier = "HIGH" | "GOOD" | "AVERAGE" | "LOW";

type ScoreImagePlugin = {
  save(options: { base64: string }): Promise<{ uri: string }>;
};

const ScoreImage = registerPlugin<ScoreImagePlugin>("ScoreImage");

const MESSAGES = {
  "SINGLE": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Wow… you're actually TOO good at this. How are you still single? 😭💚", share: "\"Send this to your crush. Maybe today is finally your day 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okayyy, you know your red flags… now you just need someone to test them on. 👀", share: "\"Share this with your friends and let them explain why you're still single 😂\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You can identify red flags… but you probably date them anyway. 💀🚩", share: "\"Send this to your single friends. Someone needs to learn 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "No wonder you're still single. You'd probably call a red flag ‘interesting personality.’ 🚩😭", share: "\"Share this with your friends. Maybe they can save your dating life 😂\"" }
  },
  "TALKING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "You’re not just talking… you actually know what you're doing. 👀💚", share: "\"Send this to the person you're talking to. Let’s see if they agree 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "The talking stage is looking promising… just don't ignore the red flags now. 😭", share: "\"Share this with them and see what they score 👀\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You two are talking… but your red flag is definitely showing. 💀🚩", share: "\"Send this to the person you're talking to. Time for a reality check 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Bro… you're one ‘it's just their personality’ away from disaster. 🚩💀", share: "\"Send this to your talking stage before it's too late 😭\"" }
  },
  "DATING": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Okay, you're actually relationship material. Your date picked well. 💚👀", share: "\"Send this to your partner. They deserve to know they picked a Green Flag 💚\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Not bad… your relationship has more Green Flags than questionable decisions. 😂💚", share: "\"Share this with your date and see if they get the same score 👀\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You're doing okay… but your red flags are starting to show. 😭🚩", share: "\"Send this to your date. Let them judge your score 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "We need to talk about your dating choices… because the red flags are basically waving at you. 🚩💀", share: "\"Send this to your date. Let's see if they still want to go on another one 😂\"" }
  },
  "IN A RELATIONSHIP": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "Your partner is seriously lucky. You’re basically a walking Green Flag. 💚🏆", share: "\"Send this to your partner so they know how lucky they are 👀❤️\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Okay, we approve. Your partner made a pretty good choice. 💚😂", share: "\"Share this with your partner. They need some appreciation today ❤️\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "You're a Red Flag… with a few good intentions. 😭🚩", share: "\"Send this to your partner and let them decide if they agree 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "Your partner deserves a medal for surviving your red flags. 💀🚩", share: "\"Share this with your partner. They deserve to know what they're dealing with 😭\"" }
  },
  "IT'S COMPLICATED": {
    "HIGH": { expertTitle: "FLAG EXPERT", result: "It's complicated… but at least YOU aren't the complicated one. 💚😭", share: "\"Send this to the person who makes your relationship complicated 👀\"" },
    "GOOD": { expertTitle: "GREEN FLAG", result: "Your relationship status is complicated, but your Green Flag detection isn't. Respect. 💚", share: "\"Share this with them and maybe finally figure out what's going on 😂\"" },
    "AVERAGE": { expertTitle: "RED FLAG ENERGY", result: "Yeah… your red flags explain why it's complicated. 💀🚩", share: "\"Send this to the person you're ‘complicated’ with 😂\"" },
    "LOW": { expertTitle: "RED FLAG ALERT", result: "It's complicated because apparently neither of you knows what a red flag looks like. 🚩💀", share: "\"Share this with them. Maybe this game can fix what your communication couldn't 😭\"" }
  }
};

export function QuizResults({ results, onRetake }: QuizResultsProps) {
  const [relStatus, setRelStatus] = useState<RelationshipStatus>("SINGLE");
  const [displayScore, setDisplayScore] = useState(0);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);

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
  if (percentage >= 90) scoreTier = "HIGH";
  else if (percentage >= 70) scoreTier = "GOOD";
  else if (percentage >= 40) scoreTier = "AVERAGE";
  else scoreTier = "LOW";

  const isRedFlag = percentage < 70;
  const messageData = MESSAGES[relStatus][scoreTier];

  // Dynamic personality title based on score
  let personalityTitle = "FLAG EXPERT";
  if (percentage >= 90) personalityTitle = "FLAG EXPERT";
  else if (percentage >= 70) personalityTitle = "PRETTY AWARE";
  else if (percentage >= 40) personalityTitle = "RED FLAG ENERGY";
  else personalityTitle = "WE NEED TO TALK";

  // Parse message into main title (Juana) and subtitle (Sans)
  const rawMsg = messageData.result;
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
    title: isRedFlag ? "YOU'RE A RED FLAG" : "YOU'RE A GREEN FLAG",
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

  const configuredShareUrl = process.env.NEXT_PUBLIC_SHARE_URL?.replace(/\/+$/, "");
  const getShareUrl = () => configuredShareUrl ? `${configuredShareUrl}/test` : undefined;
  const getShareText = () => {
    const shareUrl = getShareUrl();
    return shareUrl
      ? `I got ${percentage}% on the Red Flag test. Can you beat my score?\n\nTake the test: ${shareUrl}`
      : `I got ${percentage}% on the Red Flag test. Can you beat my score?`;
  };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const copiedText = document.execCommand("copy");
      textArea.remove();
      return copiedText;
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) {
      setShareFeedback("A public share URL has not been configured yet.");
      return;
    }

    const didCopy = await copyToClipboard(shareUrl);
    setShareFeedback(didCopy ? "Link copied!" : "Couldn't copy the link. Please try again.");
  };

  const createScoreImage = async () => {
    if (!scoreCardRef.current) {
      throw new Error("Score card is not ready");
    }

    const scoreCard = scoreCardRef.current;

    // html-to-image serializes the card into an SVG before drawing it on a
    // canvas. Android WebView can produce a blank canvas when this happens
    // while the card's fonts or local image assets are still pending.
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await Promise.all(
      Array.from(scoreCard.querySelectorAll("img")).map(async (image) => {
        if (!image.complete) {
          await new Promise<void>((resolve, reject) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => reject(new Error(`Couldn't load ${image.src}`)), { once: true });
          });
        }

        if (!image.naturalWidth) {
          throw new Error(`Couldn't load ${image.src}`);
        }

        if ("decode" in image) {
          await image.decode();
        }
      })
    );

    // Give WebView a paint after assets decode before its SVG/canvas snapshot.
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

    const image = await toBlob(scoreCard, {
      backgroundColor: "#090909",
      cacheBust: true,
      pixelRatio: 1,
      width: 1080,
      height: 1920,
      canvasWidth: 1080,
      canvasHeight: 1920,
    });

    if (!image) {
      throw new Error("Could not create score image");
    }

    return new File([image], "red-flag-score.png", { type: "image/png" });
  };

  const fileToBase64 = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    return dataUrl.split(",")[1];
  };

  const handleShareResult = async () => {
    if (isPreparingShare) return;

    const shareOptions = {
      title: "My Red Flag result",
      text: getShareText(),
    };

    try {
      setIsPreparingShare(true);
      setShareFeedback("");
      const scoreImage = await createScoreImage();

      // The spinner is for image generation only; the native share sheet owns
      // the interface after this point.
      setIsPreparingShare(false);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      if (Capacitor.isNativePlatform()) {
        const { Share } = await import("@capacitor/share");
        const { uri } = await ScoreImage.save({ base64: await fileToBase64(scoreImage) });
        await Share.share({ ...shareOptions, files: [uri], dialogTitle: "Share your Red Flag result" });
        return;
      }

      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [scoreImage] }))) {
        await navigator.share({ ...shareOptions, files: [scoreImage] });
      } else {
        setShareFeedback("This browser cannot share images. Open the app to share your score card.");
      }
    } catch {
      // Dismissing a share sheet is expected; keep the dialog available for another try.
      setShareFeedback("Couldn't open sharing options. Please try again.");
    } finally {
      setIsPreparingShare(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none bg-black"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-screen h-[100dvh]">
        <Image
          src={theme.bgImage}
          alt="Background"
          fill
          priority
          className="object-cover opacity-70 mix-blend-screen"
        />
        <div className="absolute inset-0 z-10 bg-black/55" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/35 via-black/15 to-black/95" />
      </div>

      {/*
        The score card must not live inside this overflow-hidden result layer.
        A portal lets WebView paint the full capture surface before html-to-image
        serializes it, while the negative stack keeps it out of the interface.
      */}
      {typeof document !== "undefined" && createPortal(
        <ShareCardTemplate ref={scoreCardRef} percentage={percentage} isRedFlag={isRedFlag} className="pointer-events-none fixed left-0 top-0 -z-10" />,
        document.body
      )}

      {/* Main Content Container */}
      <div className="absolute inset-0 m-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-transparent pb-[calc(2rem+env(safe-area-inset-bottom))] font-sans pointer-events-auto">

        {/* Top Header */}
        <div className="relative z-20 flex w-full flex-shrink-0 items-start justify-between px-5 pb-5 pt-[max(2.5rem,env(safe-area-inset-top))]">
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
            <p className="text-[7px] tracking-[0.25em] uppercase text-white/80 mb-2 font-medium text-right leading-[1.6]">BETTER<br />PEOPLE<br />BRIGHTER<br />DAYS</p>
            <div className="w-6 h-[1px] bg-white/40" />
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-20 flex w-full flex-col items-center px-5 pt-2">

          {/* Result Title */}
          <div className="text-center flex flex-col items-center z-10">
            <p className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase text-white">
              YOUR RESULT
            </p>

            {/* Percentage & Flag text */}
            <div className="relative flex flex-col items-center justify-center pt-2">
              <div className="flex items-end">
                <h1
                  className="font-juana text-[96px] leading-none tracking-tighter sm:text-[120px]"
                  style={{
                    background: theme.gradient,
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {displayScore}
                </h1>
                <span className="mb-3 font-juana text-[34px] sm:text-[40px]"
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
                className="mt-2 max-w-full font-juana text-[28px] leading-[1.1] tracking-wide uppercase drop-shadow-lg text-center sm:text-[42px]"
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
            className="relative z-0 mb-6 mt-2 flex h-[190px] w-full max-w-[280px] items-center justify-center"
          >
            {/* Orbit rings */}
            <div className={`absolute w-[100%] h-[100%] rounded-[100%] border-[0.5px] ${theme.orbitBorder} rotate-[-12deg] scale-y-[0.35] ${theme.orbitGlow}`}></div>
            <div className={`absolute w-[100%] h-[100%] rounded-[100%] border-[0.5px] border-white/20 rotate-[-12deg] scale-y-[0.35]`}></div>

            <div className="relative z-10 h-[220px] w-[220px] pointer-events-none sm:h-[240px] sm:w-[240px]">
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
            className={`relative z-20 mb-2 flex w-full flex-col items-center overflow-hidden rounded-[28px] border ${theme.cardBorder} bg-[#0a0a0a]/60 px-5 py-7 backdrop-blur-xl sm:rounded-[32px] sm:px-6 sm:py-8 ${theme.cardGlow}`}
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

              <h3 className="mb-2 px-1 text-center font-juana text-[24px] font-medium leading-[1.2] text-white sm:px-2 sm:text-[30px]">
                {firstWords} <br />
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

                <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 backdrop-blur-md sm:p-5">
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
          className="relative z-20 mt-6 flex w-full flex-shrink-0 flex-col items-center gap-3 px-5 pb-2"
        >
          <button
            onClick={() => {
              setShareFeedback("");
              setShowShareModal(true);
            }}
            className={`w-full py-4 rounded-[100px] flex items-center justify-center ${theme.primaryBtnBg} hover:opacity-90 transition-opacity font-medium text-[15px]`}
          >
            <span>Share Result</span>
            <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2} />
          </button>

          <button
            onClick={() => {
              const shareUrl = getShareUrl();
              if (!shareUrl) {
                setShareFeedback("A public share URL has not been configured yet.");
                setShowShareModal(true);
                return;
              }

              const challengeText = `I just got ${percentage}% Green Flag. Think you can beat me?\n\nTake the test: ${shareUrl}`;
              void copyToClipboard(challengeText).then((didCopy) => {
                if (didCopy) {
                  setShowChallengeModal(true);
                } else {
                  setShareFeedback("Couldn't copy the challenge. Please try again.");
                  setShowShareModal(true);
                }
              });
            }}
            className="w-full py-4 rounded-[100px] border border-white/20 flex items-center justify-center gap-3 text-white bg-[#1a1a1a]/40 backdrop-blur-md hover:bg-white/10 transition-colors font-medium text-[15px]"
          >
            Think they can beat you? <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            onClick={onRetake}
            className="mt-6 flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-[11px] uppercase tracking-[0.2em] font-medium text-white/80 hover:text-white hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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

      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-4 pointer-events-auto sm:items-center sm:pb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-result-title"
              className="w-full max-w-[390px] rounded-[28px] border border-white/10 bg-[#121212] p-5 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p id="share-result-title" className="text-[18px] font-medium text-white">Share your result</p>
                  <p className="mt-1 text-[12px] text-white/55">Challenge your friends to beat {percentage}%.</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  aria-label="Close share options"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-5 w-5" /></span>
                  WhatsApp
                </a>
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white"><Camera className="h-5 w-5" /></span>
                  Instagram
                </a>
                <button
                  onClick={() => void handleShareResult()}
                  disabled={isPreparingShare}
                  className="flex flex-col items-center gap-2 rounded-2xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-wait disabled:opacity-45"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white"><Users className="h-5 w-5" /></span>
                  Facebook
                </button>
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-2 rounded-2xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black"><AtSign className="h-5 w-5" /></span>
                  X
                </a>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-[13px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  {shareFeedback === "Link copied!" ? <Check className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4" />}
                  {shareFeedback === "Link copied!" ? "Link copied" : "Copy link"}
                </button>
                <button
                  onClick={() => void handleShareResult()}
                  disabled={isPreparingShare}
                  className="mt-2 flex w-full items-center justify-center gap-2 py-2 text-[12px] text-white/55 transition-colors hover:text-white"
                >
                  <Share2 className="h-3.5 w-3.5" /> More sharing options
                </button>
                {shareFeedback && shareFeedback !== "Link copied!" && (
                  <p className="mt-3 text-center text-[11px] text-green-300">{shareFeedback}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPreparingShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm pointer-events-auto"
            role="status"
            aria-live="polite"
            aria-label="Preparing your image"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="flex w-full max-w-[260px] flex-col items-center rounded-[24px] border border-white/15 bg-[#121212]/95 px-6 py-7 shadow-2xl"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#c2f2b3]" />
              <p className="mt-5 text-center text-[15px] font-medium text-white">Preparing your image...</p>
              <p className="mt-1 text-center text-[11px] text-white/50">Just a moment</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
