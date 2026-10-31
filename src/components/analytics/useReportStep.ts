"use client";

import { useCallback, useEffect, useState } from "react";

/** Screens 1 to 4 of the report; 5 is the original score card screen that follows them. */
export type ReportStep = 1 | 2 | 3 | 4 | 5;
export const SCORE_CARD_STEP: ReportStep = 5;

interface ReportHistoryState {
  reportStep?: ReportStep;
  reportDepth?: number;
}

const readHistoryState = () => (window.history.state ?? {}) as ReportHistoryState;

/**
 * Keeps the current screen in browser history, so the Android back button walks
 * back through the report and a refresh lands on the same screen.
 */
export function useReportStep(resume: boolean) {
  const [view, setView] = useState<{ step: ReportStep; direction: 1 | -1 }>(() => ({
    step: (resume && readHistoryState().reportStep) || 1,
    direction: 1,
  }));

  useEffect(() => {
    if (!resume) {
      // This history entry may still carry a step from an earlier round.
      window.history.replaceState({ reportStep: 1, reportDepth: 0 }, "");
    }

    const handlePopState = (event: PopStateEvent) => {
      const step: ReportStep = (event.state as ReportHistoryState | null)?.reportStep ?? 1;
      setView((current) => ({ step, direction: step >= current.step ? 1 : -1 }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [resume]);

  const goTo = useCallback((step: ReportStep) => {
    const reportDepth = (readHistoryState().reportDepth ?? 0) + 1;
    window.history.pushState({ reportStep: step, reportDepth }, "");
    setView({ step, direction: 1 });
  }, []);

  const goBack = useCallback(() => {
    if ((readHistoryState().reportDepth ?? 0) > 0) {
      window.history.back();
      return;
    }

    // Nothing to return to in history, for example in a tab restored at this screen.
    setView((current) => {
      const step = Math.max(current.step - 1, 1) as ReportStep;
      window.history.replaceState({ reportStep: step, reportDepth: 0 }, "");
      return { step, direction: -1 };
    });
  }, []);

  return { step: view.step, direction: view.direction, goTo, goBack };
}
