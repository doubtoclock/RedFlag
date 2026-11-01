"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AtSign, Camera, Check, Link as LinkIcon, MessageCircle, Share2, X } from "lucide-react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { toBlob } from "html-to-image";
import { createPortal } from "react-dom";
import { useMemo, useRef, useState } from "react";
import { ShareCardTemplate } from "./ShareCardTemplate";
import { ReportFlow } from "@/components/analytics/ReportFlow";
import { useReportStep, type ReportStep } from "@/components/analytics/useReportStep";
import { buildAnalyticsReport } from "@/lib/analytics/engine";
import { getArchetypeImage } from "@/lib/analytics/personalities";
import type { QuizAnswer } from "@/lib/analytics/types";

interface QuizResultsProps {
  results: QuizAnswer[];
  resume?: boolean;
  onRetake: () => void;
}

type ScoreImagePlugin = {
  save(options: { base64: string }): Promise<{ uri: string }>;
};

const ScoreImage = registerPlugin<ScoreImagePlugin>("ScoreImage");

export function QuizResults({ results, resume = false, onRetake }: QuizResultsProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState("");
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const { step, direction, goTo, goBack } = useReportStep(resume);

  const report = useMemo(() => buildAnalyticsReport(results), [results]);
  const { greenPercent: percentage, isRedFlag } = report.overall;
  const accent = report.personality.accent;

  const configuredShareUrl = process.env.NEXT_PUBLIC_SHARE_URL?.replace(/\/+$/, "");
  const getShareUrl = () => (configuredShareUrl ? `${configuredShareUrl}/test` : undefined);
  const getShareText = () => {
    const shareUrl = getShareUrl();
    return shareUrl
      ? `I scored ${percentage}% (${report.personality.title}) on the Red Flag test. Can you beat my score?\n\nTake the test: ${shareUrl}`
      : `I scored ${percentage}% (${report.personality.title}) on the Red Flag test. Can you beat my score?`;
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
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 overflow-hidden bg-black font-sans"
    >
      {/* Background Asset Layer (Same as The verdict is in. page) */}
      <div className="absolute inset-0 z-0 w-screen h-[100dvh] pointer-events-none overflow-hidden">
        <Image
          src="/result-bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-70 mix-blend-screen"
        />
        <div className="absolute inset-0 z-10 bg-black/65" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/85 via-black/45 to-black/95" />
        <div
          className="absolute inset-0 z-20"
          style={{
            background: isRedFlag
              ? "radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 35%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Hidden Portal for HTML-to-Image capture */}
      {typeof document !== "undefined" &&
        createPortal(
          <ShareCardTemplate
            ref={scoreCardRef}
            summary={report.share}
            personality={report.personality}
            overall={report.overall}
            className="pointer-events-none fixed left-0 top-0 -z-10"
          />,
          document.body
        )}

      {/* Main 4-step report flow */}
      <ReportFlow
        key="report"
        report={report}
        step={step}
        direction={direction}
        onContinue={() => goTo((step + 1) as ReportStep)}
        onBack={goBack}
        onShare={() => {
          setShareFeedback("");
          setShowShareModal(true);
        }}
        onRetake={onRetake}
      />

      {/* Share Modal with Score Card Preview */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShareModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-4 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-result-title"
              className="w-full max-w-[380px] max-h-[92vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#121212] p-4 sm:p-5 shadow-2xl flex flex-col items-center"
            >
              {/* Modal Top Bar */}
              <div className="mb-3 flex items-center justify-between w-full">
                <div>
                  <p id="share-result-title" className="text-[17px] font-medium text-white font-sans">Share Score Card</p>
                  <p className="text-[11.5px] text-white/55 font-sans">Preview your card before sharing</p>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  aria-label="Close share options"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Score Card Visual Preview (Matches attached image) */}
              <div className="relative w-full aspect-[9/13.5] max-w-[300px] rounded-[22px] border border-white/15 bg-black/80 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-5 my-1 text-center">
                {/* Background image & gradient (Same as The verdict is in. page) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <Image
                    src="/result-bg.png"
                    alt=""
                    fill
                    className="object-cover opacity-60 mix-blend-screen"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-black/95" />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isRedFlag
                        ? "radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.15) 0%, transparent 60%)"
                        : "radial-gradient(circle at 50% 35%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Card Top: Score Badge */}
                <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[9.5px] font-semibold tracking-[0.2em] uppercase text-white/90 backdrop-blur-sm">
                  <span>{percentage}%</span>
                  <span className="opacity-40">•</span>
                  <span className={isRedFlag ? "text-red-300" : "text-green-300"}>{isRedFlag ? "Red Flag" : "Green Flag"}</span>
                </div>

                {/* Card Center: Archetype Artwork & Info */}
                <div className="relative z-10 flex flex-col items-center my-auto w-full pb-2">
                  {/* Archetype Artwork */}
                  <div className="relative my-2 flex h-[104px] w-[104px] items-center justify-center overflow-hidden rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
                    <Image
                      src={report.personality.image || getArchetypeImage(report.personality.id)}
                      alt={report.personality.title}
                      fill
                      sizes="104px"
                      className="object-contain"
                    />
                  </div>

                  {/* Title in Juana */}
                  <h3
                    className="font-juana text-[22px] sm:text-[24px] font-normal leading-[1.1] tracking-tight mt-2 text-center"
                    style={{ color: accent }}
                  >
                    {report.personality.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-[11.5px] sm:text-[12.5px] text-white/80 font-light leading-relaxed max-w-[250px] font-sans">
                    {report.personality.description}
                  </p>
                </div>
              </div>

              {/* Primary Share Action */}
              <button
                onClick={() => void handleShareResult()}
                disabled={isPreparingShare}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-[13.5px] bg-gradient-to-r from-[#eedbc2] to-[#e4cbad] text-black hover:brightness-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(238,219,194,0.2)] disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                {isPreparingShare ? "Preparing card..." : "Share Card Image"}
              </button>

              {/* Social Quick Share Grid */}
              <div className="mt-3 grid grid-cols-4 gap-2 w-full">
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"><MessageCircle className="h-4 w-4" /></span>
                  WhatsApp
                </a>
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white"><Camera className="h-4 w-4" /></span>
                  Instagram
                </a>
                <a
                  href="#share-result"
                  onClick={(event) => { event.preventDefault(); void handleShareResult(); }}
                  aria-disabled={isPreparingShare}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white ${isPreparingShare ? "pointer-events-none opacity-45" : ""}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black"><AtSign className="h-4 w-4" /></span>
                  X
                </a>
                <button
                  onClick={handleCopyLink}
                  className="flex flex-col items-center gap-1.5 rounded-xl py-2 text-[10px] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white border border-white/15">
                    {shareFeedback === "Link copied!" ? <Check className="h-4 w-4 text-green-400" /> : <LinkIcon className="h-4 w-4" />}
                  </span>
                  {shareFeedback === "Link copied!" ? "Copied" : "Copy Link"}
                </button>
              </div>

              {shareFeedback && (
                <p className="mt-2 text-center text-[11px] text-[#eedbc2]">{shareFeedback}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preparing Share Image Spinner */}
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
